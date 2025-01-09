'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  updateDoc, 
  getDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface User {
  uid: string;
  email: string;
  username: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Email doğrulama durumunu kontrol et ve Firestore'u güncelle
  const checkEmailVerification = useCallback(async (firebaseUser: FirebaseUser) => {
    try {
      // Firebase user'ı yenile
      await firebaseUser.reload();
      const updatedUser = auth.currentUser;
      
      if (updatedUser && updatedUser.emailVerified) {
        // Firestore'daki kullanıcı verisini güncelle
        const userRef = doc(db, 'users', updatedUser.uid);
        await updateDoc(userRef, {
          emailVerified: true
        });

        // Context'teki user state'ini güncelle
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUser({
            uid: updatedUser.uid,
            email: updatedUser.email!,
            username: userDoc.data().username,
            emailVerified: true,
            createdAt: userDoc.data().createdAt,
            lastLoginAt: userDoc.data().lastLoginAt,
            displayName: userDoc.data().displayName
          });
        }
      }
    } catch (error) {
      console.error('Email verification check failed:', error);
    }
  }, []);

  // Periyodik olarak email doğrulama durumunu kontrol et
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (user && !user.emailVerified) {
      interval = setInterval(async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await checkEmailVerification(currentUser);
        }
      }, 10000); // Her 10 saniyede bir kontrol et
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user, checkEmailVerification]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Kullanıcı oturum açtığında email doğrulama durumunu kontrol et
          await checkEmailVerification(firebaseUser);
          
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              username: userData.username,
              emailVerified: firebaseUser.emailVerified,
              createdAt: userData.createdAt,
              lastLoginAt: userData.lastLoginAt,
              displayName: userData.displayName
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [checkEmailVerification]);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      // Önce username'e göre kullanıcıyı Firestore'dan bul
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Kullanıcı adı veya şifre hatalı');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Bulunan email ile Firebase Auth'da oturum aç
      const userCredential = await signInWithEmailAndPassword(auth, userData.email, password);
      
      // Login timestamp'ini güncelle
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        lastLoginAt: new Date().toISOString()
      });

      // Email doğrulama durumunu kontrol et
      await checkEmailVerification(userCredential.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      return data;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 
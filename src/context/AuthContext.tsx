'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface User {
  username: string;
  email: string;
  uid: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, email: string, uid: string) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Token'dan kullanıcı bilgilerini al
  const getUserFromToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Auth state'i yenile
      await auth.authStateReady();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          username: userData.username,
          email: currentUser.email || '',
          uid: currentUser.uid
        });
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Sayfa yüklendiğinde token kontrolü yap
    getUserFromToken();

    // Firebase Auth state değişikliklerini dinle
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              username: userData.username,
              email: firebaseUser.email || '',
              uid: firebaseUser.uid
            });
          } else {
            setUser(null);
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (username: string, email: string, uid: string) => {
    try {
      // Wait for Firebase to initialize
      await auth.authStateReady();
      
      // Add a longer delay to ensure Firebase has time to process the auth state
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        console.error('User session not found after login');
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      // Get fresh token and user data
      const token = await currentUser.getIdToken(true);
      localStorage.setItem('token', token);

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        await setDoc(doc(db, 'users', currentUser.uid), {
          username,
          email: email.toLowerCase(),
          createdAt: new Date().toISOString()
        });
      }

      // Update context
      setUser({ username, email, uid });
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      localStorage.removeItem('token');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
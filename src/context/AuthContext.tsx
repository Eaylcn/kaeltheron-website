'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface User {
  username: string;
  email: string;
  uid: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
  updateUserEmail: (email: string) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  reauthenticateUser: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              username: userData.username,
              email: firebaseUser.email || '',
              uid: firebaseUser.uid,
              emailVerified: firebaseUser.emailVerified
            });

            // Update Firestore if email verification status changed
            if (userData.emailVerified !== firebaseUser.emailVerified) {
              await updateDoc(doc(db, 'users', firebaseUser.uid), {
                emailVerified: firebaseUser.emailVerified
              });
            }
          } else {
            setUser(null);
            localStorage.removeItem('token');
          }
        } else {
          setUser(null);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const reauthenticateUser = async (password: string) => {
    if (!user?.email || !auth.currentUser) throw new Error('No user found');
    
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  const updateUserEmail = async (email: string) => {
    if (!user || !auth.currentUser) return;
    
    try {
      await updateEmail(auth.currentUser, email.toLowerCase());
      
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        email: email.toLowerCase(),
        emailVerified: false
      });

      setUser(prev => prev ? {
        ...prev,
        email: email.toLowerCase(),
        emailVerified: false
      } : null);
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!auth.currentUser) throw new Error('No user found');

    try {
      await reauthenticateUser(currentPassword);
      await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      console.error('Error updating password:', error);
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
    logout,
    loading,
    updateUserEmail,
    updateUserPassword,
    reauthenticateUser
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
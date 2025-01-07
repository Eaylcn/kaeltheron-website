'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
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
  login: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
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
              uid: firebaseUser.uid
            });
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

  const login = async (username: string, email: string, password: string) => {
    try {
      // First sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get fresh token
      const token = await firebaseUser.getIdToken(true);
      localStorage.setItem('token', token);

      // Get or create user document in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          username,
          email: email.toLowerCase(),
          createdAt: new Date().toISOString()
        });
      }

      // Update context
      setUser({
        username,
        email: firebaseUser.email || '',
        uid: firebaseUser.uid
      });
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
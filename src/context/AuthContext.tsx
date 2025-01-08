'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface User {
  uid: string;
  email: string;
  username: string;
  emailVerified: boolean;
  createdAt: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  checkEmailVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Session kontrolü ve kullanıcı bilgilerini alma
  const checkSession = async () => {
    const sessionCookie = getCookie('session');
    
    if (sessionCookie) {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: sessionCookie }),
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          return true;
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    }
    return false;
  };

  useEffect(() => {
    let unsubscribe: () => void;

    const initAuth = async () => {
      // Önce session'ı kontrol et
      const hasValidSession = await checkSession();
      
      // Firebase auth state'ini dinle
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const response = await fetch('/api/auth/me', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ uid: firebaseUser.uid }),
            });

            if (!response.ok) {
              throw new Error('Kullanıcı bilgileri alınamadı');
            }

            const userData = await response.json();
            setUser(userData);
            
            // Session cookie'sini güncelle
            setCookie('session', firebaseUser.uid, {
              maxAge: 30 * 24 * 60 * 60, // 30 days
              path: '/',
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict'
            });
          } catch (error) {
            console.error('Auth state error:', error);
            if (!hasValidSession) {
              setUser(null);
              deleteCookie('session');
              if (window.location.pathname === '/profile') {
                router.replace('/');
              }
            }
          }
        } else {
          if (!hasValidSession) {
            setUser(null);
            deleteCookie('session');
            if (window.location.pathname === '/profile') {
              router.replace('/');
            }
          }
        }
        setLoading(false);
      });
    };

    initAuth();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [router]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const userData = await response.json();
      setUser(userData);
      
      // Set session cookie after successful login
      setCookie('session', userData.uid, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      setUser(null);
      deleteCookie('session');
      router.replace('/');
    } finally {
      setLoading(false);
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

  const checkEmailVerification = async () => {
    if (!user?.uid) return;

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: user.uid }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const { emailVerified } = await response.json();
      
      if (emailVerified && user) {
        setUser({ ...user, emailVerified });
      }
    } catch (error) {
      console.error('Email verification check error:', error);
    }
  };

  useEffect(() => {
    // Auth state değişikliklerini dinle
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Kullanıcı oturum açtığında veya durumu değiştiğinde
        try {
          // Kullanıcı bilgilerini yenile
          await user.reload();
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          
          setUser({
            uid: user.uid,
            email: user.email || '',
            username: userData?.username || '',
            emailVerified: user.emailVerified,
            createdAt: userData?.createdAt || null,
          });
        } catch (error) {
          console.error('Error refreshing user data:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Email doğrulama durumunu kontrol et
    let emailVerificationTimer: NodeJS.Timeout;
    if (user && !user.emailVerified) {
      emailVerificationTimer = setInterval(async () => {
        try {
          // Mevcut Firebase kullanıcısını al
          const currentUser = auth.currentUser;
          if (currentUser) {
            // Kullanıcı bilgilerini yenile
            await currentUser.reload();
            // Eğer email doğrulandıysa
            if (currentUser.emailVerified) {
              // Context'teki kullanıcı bilgilerini güncelle
              const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
              const userData = userDoc.data();
              
              setUser({
                uid: currentUser.uid,
                email: currentUser.email || '',
                username: userData?.username || '',
                emailVerified: true,
                createdAt: userData?.createdAt || null,
              });
              // Timer'ı temizle
              clearInterval(emailVerificationTimer);
            }
          }
        } catch (error) {
          console.error('Error checking email verification:', error);
        }
      }, 3000); // Her 3 saniyede bir kontrol et
    }

    // Cleanup
    return () => {
      unsubscribe();
      if (emailVerificationTimer) {
        clearInterval(emailVerificationTimer);
      }
    };
  }, [user?.uid]);

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    checkEmailVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
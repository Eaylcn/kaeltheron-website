import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface CustomUser extends User {
  isAdmin?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Firestore'dan kullanıcı verilerini al
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        
        // CustomUser nesnesini oluştur
        const customUser: CustomUser = {
          ...firebaseUser,
          isAdmin: userData?.isAdmin || false
        };
        
        setUser(customUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  return { user, loading };
} 
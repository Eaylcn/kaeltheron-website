import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface UserData {
  username: string;
  email: string;
  createdAt: string;
  emailVerified: boolean;
}

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { message: 'Kullanıcı adı gerekli' },
        { status: 400 }
      );
    }

    console.log('Checking user existence:', username.toLowerCase());

    // Find user by username
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.toLowerCase()));
    
    try {
      const querySnapshot = await getDocs(q);
      const exists = !querySnapshot.empty;
      const userData = exists ? querySnapshot.docs[0].data() as UserData : null;

      console.log('User exists:', exists);
      if (userData) {
        console.log('User data:', { 
          username: userData.username,
          email: userData.email,
          createdAt: userData.createdAt,
          emailVerified: userData.emailVerified
        });
      }

      return NextResponse.json({
        exists,
        userData: exists && userData ? {
          username: userData.username,
          email: userData.email,
          createdAt: userData.createdAt,
          emailVerified: userData.emailVerified
        } : null
      });
    } catch (error) {
      console.error('Firestore query error:', error);
      return NextResponse.json(
        { message: 'Veritabanı hatası' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Validasyon kontrolleri
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return NextResponse.json(
        { message: 'Kullanıcı adı gereklidir' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      return NextResponse.json(
        { message: 'Şifre gereklidir' },
        { status: 400 }
      );
    }

    // Kullanıcı adına göre Firestore'dan email'i bul
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('username', '==', username.trim().toLowerCase())
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return NextResponse.json(
        { message: 'Kullanıcı adı veya şifre hatalı' },
        { status: 400 }
      );
    }

    // İlk eşleşen kullanıcının email'ini al
    const firestoreDoc = querySnapshot.docs[0];
    const firestoreData = firestoreDoc.data();
    const email = firestoreData.email;

    // Email ve şifre ile giriş yap
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return NextResponse.json({
      username: username.trim(),
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: firestoreData.createdAt || new Date().toISOString()
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    
    if (error instanceof FirebaseError) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        return NextResponse.json(
          { message: 'Kullanıcı adı veya şifre hatalı' },
          { status: 400 }
        );
      }

      if (error.code === 'auth/too-many-requests') {
        return NextResponse.json(
          { message: 'Çok fazla başarısız giriş denemesi yaptınız. Lütfen daha sonra tekrar deneyin.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { message: 'Giriş yaparken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
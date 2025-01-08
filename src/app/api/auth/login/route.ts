import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { adminDb } from '@/lib/firebase-admin';

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
    const usersSnapshot = await adminDb
      .collection('users')
      .where('username', '==', username.trim().toLowerCase())
      .get();

    if (usersSnapshot.empty) {
      return NextResponse.json(
        { message: 'Kullanıcı adı veya şifre hatalı' },
        { status: 400 }
      );
    }

    // İlk eşleşen kullanıcının email'ini al
    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();
    const email = userData.email;

    // Firebase ile giriş yap
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firebase Auth'dan email verification durumunu kontrol et
    const isEmailVerified = user.emailVerified;

    // Firestore'daki kullanıcı verisini güncelle
    await adminDb.collection('users').doc(user.uid).update({
      emailVerified: isEmailVerified
    });

    return NextResponse.json({
      uid: user.uid,
      email: user.email,
      username: userData.username,
      displayName: userData.displayName,
      emailVerified: isEmailVerified,
      createdAt: userData.createdAt
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    
    if (error instanceof FirebaseError) {
      if (error.code === 'auth/wrong-password') {
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

      return NextResponse.json(
        { message: `Firebase hatası: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Giriş yaparken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
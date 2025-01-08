import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validasyon kontrolleri
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { message: 'E-posta adresi gereklidir' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      return NextResponse.json(
        { message: 'Şifre gereklidir' },
        { status: 400 }
      );
    }

    // Firebase ile giriş yap
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    // Kullanıcı bilgilerini Firestore'dan al ve email verification durumunu güncelle
    const userDoc = await adminDb.collection('users').doc(user.uid).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Firebase Auth'dan email verification durumunu kontrol et
    const isEmailVerified = user.emailVerified;

    // Firestore'daki kullanıcı verisini güncelle
    await adminDb.collection('users').doc(user.uid).update({
      emailVerified: isEmailVerified
    });

    const userData = userDoc.data();

    return NextResponse.json({
      uid: user.uid,
      email: user.email,
      username: userData?.username,
      displayName: userData?.displayName,
      emailVerified: isEmailVerified,
      createdAt: userData?.createdAt
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    
    if (error instanceof FirebaseError) {
      if (error.code === 'auth/invalid-email') {
        return NextResponse.json(
          { message: 'Geçersiz e-posta adresi' },
          { status: 400 }
        );
      }

      if (error.code === 'auth/user-not-found') {
        return NextResponse.json(
          { message: 'Kullanıcı bulunamadı' },
          { status: 404 }
        );
      }

      if (error.code === 'auth/wrong-password') {
        return NextResponse.json(
          { message: 'Hatalı şifre' },
          { status: 400 }
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
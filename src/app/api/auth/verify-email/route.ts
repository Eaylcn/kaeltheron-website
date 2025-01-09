import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { db } from '@/lib/firebase-admin';

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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // E-posta doğrulama durumunu kontrol et
    if (!user.emailVerified) {
      return NextResponse.json(
        { message: 'E-posta adresi henüz doğrulanmamış' },
        { status: 400 }
      );
    }

    // Firestore'daki kullanıcı verisini güncelle
    await db.collection('users').doc(user.uid).update({
      emailVerified: true,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({
      message: 'E-posta adresi başarıyla doğrulandı'
    });
  } catch (error: unknown) {
    console.error('Email verification error:', error);

    if (error instanceof FirebaseError) {
      if (error.code === 'auth/wrong-password') {
        return NextResponse.json(
          { message: 'Geçersiz şifre' },
          { status: 400 }
        );
      }

      if (error.code === 'auth/user-not-found') {
        return NextResponse.json(
          { message: 'Kullanıcı bulunamadı' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: `Doğrulama hatası: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'E-posta doğrulanırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
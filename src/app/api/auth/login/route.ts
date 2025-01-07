import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

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

    return NextResponse.json({
      username: user.displayName,
      email: user.email
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    
    // Firebase hata mesajlarını kontrol et
    if (error instanceof FirebaseError) {
      if (error.code === 'auth/missing-email') {
        return NextResponse.json(
          { message: 'E-posta adresi gereklidir' },
          { status: 400 }
        );
      }

      if (error.code === 'auth/invalid-email') {
        return NextResponse.json(
          { message: 'Geçersiz e-posta adresi' },
          { status: 400 }
        );
      }

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        return NextResponse.json(
          { message: 'E-posta adresi veya şifre hatalı' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { message: 'Giriş yapılırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
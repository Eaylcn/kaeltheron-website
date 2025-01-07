import { NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Token oluştur
    const token = await user.getIdToken();

    return NextResponse.json({
      token,
      username: user.displayName || 'Kullanıcı',
      email: user.email,
      uid: user.uid
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof FirebaseError) {
      return NextResponse.json(
        { message: 'Giriş yapılamadı. E-posta veya şifre hatalı.' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 
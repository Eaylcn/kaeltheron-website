import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Firebase ile giriş yap
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return NextResponse.json({
      username: user.displayName,
      email: user.email
    });
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Firebase hata mesajlarını kontrol et
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      return NextResponse.json(
        { message: 'E-posta adresi veya şifre hatalı' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Giriş yapılırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
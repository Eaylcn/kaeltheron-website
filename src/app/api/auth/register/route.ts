import { NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Kullanıcı oluştur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Kullanıcı adını güncelle
    await updateProfile(user, {
      displayName: username
    });

    // Token oluştur
    const token = await user.getIdToken();

    return NextResponse.json({
      token,
      username: user.displayName || username,
      email: user.email,
      uid: user.uid
    });
  } catch (error) {
    console.error('Register error:', error);
    
    if (error instanceof FirebaseError) {
      if (error.code === 'auth/email-already-in-use') {
        return NextResponse.json(
          { message: 'Bu e-posta adresi zaten kullanımda' },
          { status: 400 }
        );
      }

      if (error.code === 'auth/weak-password') {
        return NextResponse.json(
          { message: 'Şifre çok zayıf. En az 6 karakter kullanın' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: 'Kayıt olurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
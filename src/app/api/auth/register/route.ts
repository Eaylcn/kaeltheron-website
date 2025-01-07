import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Validasyon kontrolleri
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return NextResponse.json(
        { message: 'Kullanıcı adı gereklidir' },
        { status: 400 }
      );
    }

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

    // Firebase ile kullanıcı oluştur
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    // Kullanıcı adını güncelle
    await updateProfile(user, {
      displayName: username.trim()
    });

    return NextResponse.json({
      username: username.trim(),
      email: user.email
    });
  } catch (error: unknown) {
    console.error('Register error:', error);
    
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

      if (error.code === 'auth/email-already-in-use') {
        return NextResponse.json(
          { message: 'Bu e-posta adresi zaten kullanılıyor' },
          { status: 400 }
        );
      }
      
      if (error.code === 'auth/weak-password') {
        return NextResponse.json(
          { message: 'Şifre en az 6 karakter olmalıdır' },
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
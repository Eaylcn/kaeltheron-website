import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Firebase ile kullanıcı oluştur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Kullanıcı adını güncelle
    await updateProfile(user, {
      displayName: username
    });

    return NextResponse.json({
      username,
      email: user.email
    });
  } catch (error: any) {
    console.error('Register error:', error);
    
    // Firebase hata mesajlarını kontrol et
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

    return NextResponse.json(
      { message: 'Kayıt olurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
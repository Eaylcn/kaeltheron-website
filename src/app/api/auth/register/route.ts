import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { db } from '@/lib/firebase-admin';

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

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { message: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Kullanıcı adının benzersiz olduğunu kontrol et
    const usernameSnapshot = await db
      .collection('users')
      .where('username', '==', username.trim().toLowerCase())
      .get();

    if (!usernameSnapshot.empty) {
      return NextResponse.json(
        { message: 'Bu kullanıcı adı zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // E-posta adresinin benzersiz olduğunu kontrol et
    const emailSnapshot = await db
      .collection('users')
      .where('email', '==', email.trim().toLowerCase())
      .get();

    if (!emailSnapshot.empty) {
      return NextResponse.json(
        { message: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Firebase Auth ile kullanıcı oluştur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestore'a kullanıcı bilgilerini kaydet
    await db.collection('users').doc(user.uid).set({
      username: username.trim().toLowerCase(),
      displayName: username.trim(),
      email: email.trim().toLowerCase(),
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Doğrulama e-postası gönder
    await sendEmailVerification(user, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email`
    });

    return NextResponse.json({
      uid: user.uid,
      email: user.email,
      username: username.trim().toLowerCase(),
      displayName: username.trim(),
      emailVerified: false,
      createdAt: new Date().toISOString()
    });
  } catch (error: unknown) {
    console.error('Register error:', error);

    if (error instanceof FirebaseError) {
      if (error.code === 'auth/email-already-in-use') {
        return NextResponse.json(
          { message: 'Bu e-posta adresi zaten kullanılıyor' },
          { status: 400 }
        );
      }

      if (error.code === 'auth/invalid-email') {
        return NextResponse.json(
          { message: 'Geçersiz e-posta adresi' },
          { status: 400 }
        );
      }

      if (error.code === 'auth/operation-not-allowed') {
        return NextResponse.json(
          { message: 'E-posta/şifre girişi devre dışı bırakılmış' },
          { status: 400 }
        );
      }

      if (error.code === 'auth/weak-password') {
        return NextResponse.json(
          { message: 'Şifre çok zayıf' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: `Kayıt hatası: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Kayıt olurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { adminDb } from '@/lib/firebase-admin';

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

    // Admin SDK ile kullanıcı adının benzersiz olup olmadığını kontrol et
    const usernameSnapshot = await adminDb
      .collection('users')
      .where('username', '==', username.trim().toLowerCase())
      .get();

    if (!usernameSnapshot.empty) {
      return NextResponse.json(
        { message: 'Bu kullanıcı adı zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Email'in benzersiz olup olmadığını kontrol et
    const emailSnapshot = await adminDb
      .collection('users')
      .where('email', '==', email.trim().toLowerCase())
      .get();

    if (!emailSnapshot.empty) {
      return NextResponse.json(
        { message: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Firebase ile kullanıcı oluştur
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          return NextResponse.json(
            { message: 'Bu e-posta adresi zaten kullanılıyor' },
            { status: 400 }
          );
        }
        throw error;
      }
      throw error;
    }

    const user = userCredential.user;

    // Kullanıcı adını güncelle
    await updateProfile(user, {
      displayName: username.trim()
    });

    // Firestore'a kullanıcı bilgilerini kaydet (Admin SDK ile)
    const userData = {
      uid: user.uid,
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      displayName: username.trim(),
      createdAt: new Date().toISOString(),
      emailVerified: false
    };

    await adminDb.collection('users').doc(user.uid).set(userData);

    // E-posta doğrulama linki gönder
    try {
      await sendEmailVerification(user);
    } catch (emailError) {
      console.error('Email verification error:', emailError);
      // E-posta gönderimi başarısız olsa bile kullanıcı kaydını tamamla
    }

    return NextResponse.json({
      ...userData,
      message: 'Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.'
    });
  } catch (error: unknown) {
    console.error('Register error:', error);
    
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
      
      if (error.code === 'auth/weak-password') {
        return NextResponse.json(
          { message: 'Şifre en az 6 karakter olmalıdır' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: `Kayıt hatası: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Kayıt olurken beklenmeyen bir hata oluştu' },
      { status: 500 }
    );
  }
} 
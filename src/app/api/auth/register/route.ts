import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, deleteUser } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { adminDb as db } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  let createdUser = null;

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

    // Transaction başlat
    const result = await db.runTransaction(async (transaction) => {
      // Kullanıcı adının benzersiz olduğunu kontrol et
      const usernameSnapshot = await transaction.get(
        db.collection('users').where('username', '==', username.trim().toLowerCase())
      );

      if (!usernameSnapshot.empty) {
        throw new Error('Bu kullanıcı adı zaten kullanılıyor');
      }

      // E-posta adresinin benzersiz olduğunu kontrol et
      const emailSnapshot = await transaction.get(
        db.collection('users').where('email', '==', email.trim().toLowerCase())
      );

      if (!emailSnapshot.empty) {
        throw new Error('Bu e-posta adresi zaten kullanılıyor');
      }

      // Firebase Auth ile kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      createdUser = userCredential.user;

      // Firestore'a kullanıcı bilgilerini kaydet
      const userRef = db.collection('users').doc(createdUser.uid);
      transaction.set(userRef, {
        username: username.trim().toLowerCase(),
        displayName: username.trim(),
        email: email.trim().toLowerCase(),
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Doğrulama e-postası gönder
      try {
        await sendEmailVerification(createdUser, {
          url: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email` : 'http://localhost:3000/auth/verify-email',
          handleCodeInApp: true
        });
      } catch (emailError) {
        // Email gönderme hatası durumunda kullanıcıyı silme
        throw emailError;
      }

      return {
        uid: createdUser.uid,
        email: createdUser.email,
        username: username.trim().toLowerCase(),
        displayName: username.trim(),
        emailVerified: false,
        createdAt: new Date().toISOString()
      };
    });

    return NextResponse.json(result);

  } catch (error: unknown) {
    console.error('Register error:', error);

    // Hata durumunda cleanup
    if (createdUser) {
      try {
        // Kullanıcıyı Authentication'dan sil
        await deleteUser(createdUser);
        
        // Firestore dökümanını sil
        await db.collection('users').doc(createdUser.uid).delete();
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }

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

    // Diğer hatalar için
    const errorMessage = error instanceof Error ? error.message : 'Kayıt olurken bir hata oluştu';
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
} 
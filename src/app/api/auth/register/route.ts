import { NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Check if username already exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json(
        { message: 'Bu kullanıcı adı zaten kullanımda' },
        { status: 400 }
      );
    }

    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile and create user document
    await updateProfile(user, {
      displayName: username.toLowerCase()
    });

    // Send verification email
    await sendEmailVerification(user, {
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      handleCodeInApp: false,
    });

    // Create user document in Firestore
    const userDoc = doc(usersRef, user.uid);
    await setDoc(userDoc, {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      emailVerified: false,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      message: 'Kayıt başarılı! E-posta adresinize doğrulama bağlantısı gönderildi. Lütfen e-postanızı kontrol edin ve doğrulama yapın.',
      username: username.toLowerCase(),
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
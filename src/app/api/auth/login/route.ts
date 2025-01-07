import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { message: 'Şifre gerekli' },
        { status: 400 }
      );
    }

    // Find email by username
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { message: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 }
      );
    }

    // Get the first matching user's email
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Try to sign in with email and password
    try {
      const userCredential = await signInWithEmailAndPassword(auth, userData.email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      return NextResponse.json({
        token,
        email: userData.email,
        username: userData.username,
        uid: user.uid
      });
    } catch (signInError) {
      console.error('Sign in error:', signInError);
      return NextResponse.json(
        { message: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof FirebaseError) {
      return NextResponse.json(
        { message: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 
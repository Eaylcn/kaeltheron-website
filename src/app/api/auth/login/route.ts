import { NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Kullanıcı adına göre email'i bul
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { message: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 }
      );
    }

    // İlk eşleşen kullanıcının email'ini al
    const userDoc = querySnapshot.docs[0];
    const email = userDoc.data().email;

    // Email ve şifre ile giriş yap
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Wait for auth state to be ready
    await auth.authStateReady();

    // Verify user exists in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDocData = await getDoc(userDocRef);
    
    if (!userDocData.exists()) {
      throw new Error('User document not found in Firestore');
    }

    // Get fresh token
    const token = await user.getIdToken(true);

    // Return user data from Firestore
    const userData = userDocData.data();
    
    return NextResponse.json({
      token,
      username: userData.username,
      email: user.email,
      uid: user.uid
    });
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
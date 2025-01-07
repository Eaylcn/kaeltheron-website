import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { collection, query, where, getDocs } from 'firebase/firestore';

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
    const userData = userDoc.data();

    return NextResponse.json({
      email: userData.email,
      username: userData.username
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
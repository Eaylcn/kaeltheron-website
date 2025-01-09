import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FirebaseError } from 'firebase/app';

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { message: 'Kullanıcı ID gereklidir' },
        { status: 400 }
      );
    }

    // Firestore'dan kullanıcı bilgilerini al
    const userDoc = await adminDb.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    return NextResponse.json({
      uid,
      email: userData?.email,
      username: userData?.username,
      displayName: userData?.displayName,
      emailVerified: userData?.emailVerified,
      createdAt: userData?.createdAt
    });
  } catch (error: unknown) {
    console.error('Get user data error:', error);
    
    if (error instanceof FirebaseError) {
      return NextResponse.json(
        { message: `Firebase hatası: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Kullanıcı bilgileri alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
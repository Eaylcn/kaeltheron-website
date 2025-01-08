import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: 'UID gerekli' }, { status: 400 });
    }

    // Firebase Auth'dan kullanıcı bilgilerini al
    const userRecord = await auth.getUser(uid);
    
    // Firestore'dan ek kullanıcı bilgilerini al
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    if (!userRecord || !userData) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Kullanıcı bilgilerini döndür
    return NextResponse.json({
      uid: userRecord.uid,
      email: userRecord.email || '',
      username: userData.username || '',
      emailVerified: userRecord.emailVerified,
      createdAt: userData.createdAt || null,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Kullanıcı bilgileri alınamadı' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { message: 'Kullanıcı ID gereklidir' },
        { status: 400 }
      );
    }

    // Firebase Auth'dan güncel kullanıcı bilgisini al
    await auth.currentUser?.reload();
    const user = auth.currentUser;

    if (!user) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Firestore'daki doğrulama durumunu güncelle
    await updateDoc(doc(db, 'users', uid), {
      emailVerified: user.emailVerified
    });

    return NextResponse.json({
      emailVerified: user.emailVerified
    });
  } catch (error) {
    console.error('Verification check error:', error);
    return NextResponse.json(
      { message: 'Doğrulama durumu kontrol edilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
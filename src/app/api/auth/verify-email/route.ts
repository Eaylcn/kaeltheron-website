import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { message: 'Kullanıcı ID gereklidir' },
        { status: 400 }
      );
    }

    // Admin SDK ile kullanıcı bilgilerini al
    const user = await auth.currentUser;
    
    if (!user) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Kullanıcının token'ını yenile (email verification durumunu güncellemek için)
    await user.reload();

    // Email verification durumunu kontrol et
    const isEmailVerified = user.emailVerified;

    if (isEmailVerified) {
      // Firestore'daki kullanıcı verisini güncelle
      await adminDb.collection('users').doc(uid).update({
        emailVerified: true
      });

      return NextResponse.json({
        emailVerified: true,
        message: 'E-posta adresi doğrulandı'
      });
    }

    return NextResponse.json({
      emailVerified: false,
      message: 'E-posta adresi henüz doğrulanmadı'
    });
  } catch (error: unknown) {
    console.error('Email verification check error:', error);
    
    if (error instanceof FirebaseError) {
      return NextResponse.json(
        { message: `Firebase hatası: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'E-posta doğrulama durumu kontrol edilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
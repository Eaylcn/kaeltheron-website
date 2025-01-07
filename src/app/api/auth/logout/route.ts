import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export async function POST() {
  try {
    await signOut(auth);
    return NextResponse.json({ message: 'Başarıyla çıkış yapıldı' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Çıkış yaparken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
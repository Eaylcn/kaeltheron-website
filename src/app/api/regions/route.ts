import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const regionsCollection = collection(db, 'regions');
    const regionsSnapshot = await getDocs(regionsCollection);
    
    const regions: { [key: string]: any } = {};
    regionsSnapshot.forEach((doc) => {
      regions[doc.id] = { id: doc.id, ...doc.data() };
    });

    return NextResponse.json({ regions });
  } catch (error) {
    console.error('Bölgeler yüklenirken hata:', error);
    return NextResponse.json(
      { error: 'Bölgeler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
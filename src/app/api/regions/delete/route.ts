import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function DELETE(request: Request): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  try {
    const { regionId } = await request.json();

    if (!regionId) {
      return NextResponse.json({ error: 'Region ID is required' }, { status: 400 });
    }

    const regionRef = doc(db, 'regions', regionId);
    await deleteDoc(regionRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bölge silme hatası:', error);
    return NextResponse.json(
      { error: 'Bölge silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { regionId, icons, bounds, color } = data;

    const regionRef = doc(db, 'regions', regionId);
    const updateData: any = {};

    // İkonları güncelle
    if (icons) {
      updateData['locations'] = icons.map((icon: any) => ({
        name: icon.name,
        type: icon.type,
        coordinates: icon.coordinates,
        color: icon.color,
        description: icon.description,
        population: icon.population
      }));
    }

    // Sınırları güncelle
    if (bounds) {
      updateData['mapData.bounds'] = bounds;
    }

    // Rengi güncelle
    if (color) {
      updateData['mapData.color'] = color;
    }

    await updateDoc(regionRef, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bölge güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Bölge güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
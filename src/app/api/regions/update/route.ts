import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface UpdateIcon {
  name: string;
  type: string;
  coordinates: [number, number];
  color: string;
  description?: string;
  population?: string;
}

interface Point {
  x: number;
  y: number;
}

interface Color {
  fill: string;
  stroke: string;
}

interface UpdateRequest {
  regionId: string;
  icons?: UpdateIcon[];
  bounds?: Point[];
  color?: Color;
}

export async function POST(request: Request): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  try {
    const data: UpdateRequest = await request.json();
    const { regionId, icons, bounds, color } = data;

    const regionRef = doc(db, 'regions', regionId);
    const updateData: Partial<{
      locations: UpdateIcon[];
      'mapData.bounds': Point[];
      'mapData.color': Color;
    }> = {};

    if (icons) {
      updateData.locations = icons.map((icon) => ({
        name: icon.name,
        type: icon.type,
        coordinates: icon.coordinates,
        color: icon.color,
        description: icon.description,
        population: icon.population
      }));
    }

    if (bounds) {
      updateData['mapData.bounds'] = bounds;
    }

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
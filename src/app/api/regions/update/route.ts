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

    if (!regionId) {
      return NextResponse.json({ error: 'Region ID is required' }, { status: 400 });
    }

    const regionRef = doc(db, 'regions', regionId);
    const updateData: Record<string, any> = {};

    if (icons !== undefined) {
      const validIcons = icons.filter(icon => 
        icon.name && 
        icon.type && 
        Array.isArray(icon.coordinates) && 
        icon.coordinates.length === 2 &&
        icon.color
      ).map(icon => ({
        name: icon.name,
        type: icon.type,
        coordinates: icon.coordinates,
        color: icon.color,
        description: icon.description || null,
        population: icon.population || null
      }));
      updateData.locations = validIcons;
    }

    if (bounds !== undefined) {
      const validBounds = bounds.filter(point => 
        typeof point.x === 'number' && 
        typeof point.y === 'number'
      );
      updateData['mapData.bounds'] = validBounds;
    }

    if (color !== undefined && color.fill && color.stroke) {
      updateData['mapData.color'] = {
        fill: color.fill,
        stroke: color.stroke
      };
    }

    // Sadece geçerli veriler varsa güncelle
    if (Object.keys(updateData).length > 0) {
      await updateDoc(regionRef, updateData);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'No valid data to update' }, { status: 400 });
    }
  } catch (error) {
    console.error('Bölge güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Bölge güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
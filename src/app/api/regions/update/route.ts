import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, DocumentData } from 'firebase/firestore';

interface UpdateIcon {
  name: string;
  type: string;
  coordinates: [number, number];
  color: string;
  description?: string | null;
  population?: string | null;
}

interface Color {
  name?: string;
  fill: string;
  stroke: string;
}

interface MapData {
  bounds?: number[];
  color?: {
    fill: string;
    stroke: string;
  };
  center?: [number, number];
}

interface UpdateData {
  locations?: UpdateIcon[];
  mapData: MapData;
}

interface UpdateRequest {
  regionId: string;
  icons?: UpdateIcon[];
  bounds?: number[];
  color?: Color;
}

export async function POST(request: Request): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  try {
    const data: UpdateRequest = await request.json();
    const { regionId, icons, bounds, color } = data;

    console.log('Received update request:', JSON.stringify(data, null, 2));

    if (!regionId) {
      return NextResponse.json({ error: 'Region ID is required' }, { status: 400 });
    }

    const regionRef = doc(db, 'regions', regionId);
    const regionDoc = await getDoc(regionRef);
    
    if (!regionDoc.exists()) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }

    const updateData: UpdateData = {
      mapData: regionDoc.data()?.mapData || {}
    };

    // İkonları güncelle
    if (icons !== undefined) {
      updateData.locations = icons.map(icon => ({
        name: icon.name,
        type: icon.type,
        coordinates: icon.coordinates,
        color: icon.color,
        description: icon.description || null,
        population: icon.population || null
      }));
    }
    
    if (bounds !== undefined) {
      updateData.mapData.bounds = bounds;
    }

    if (color !== undefined) {
      updateData.mapData.color = {
        fill: color.fill,
        stroke: color.stroke
      };
    }

    console.log('Updating with data:', JSON.stringify(updateData, null, 2));

    await updateDoc(regionRef, updateData as DocumentData);
    console.log('Update successful');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bölge güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Bölge güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, DocumentData } from 'firebase/firestore';

interface UpdateIcon {
  name: string;
  type: string;
  coordinates: [number, number];
  color: string;
  description: string | null;
  population: string | null;
}

interface Color {
  name?: string;
  fill: string;
  stroke: string;
}

interface UpdateRequest {
  regionId: string;
  icons?: UpdateIcon[];
  bounds?: [number, number][];
  color?: Color;
}

type FirestoreData = {
  locations?: UpdateIcon[];
  mapData?: {
    bounds?: [number, number][];
    color?: {
      fill: string;
      stroke: string;
    };
    center?: [number, number];
  };
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
    
    // Mevcut belgeyi al
    const regionDoc = await getDoc(regionRef);
    if (!regionDoc.exists()) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }

    const currentData = regionDoc.data();
    const updateData: FirestoreData = {};

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

    // mapData nesnesini hazırla
    const mapData = { ...currentData.mapData } || {};

    if (bounds !== undefined && Array.isArray(bounds)) {
      const validBounds = bounds.filter(point => 
        Array.isArray(point) && 
        point.length === 2 && 
        typeof point[0] === 'number' && 
        typeof point[1] === 'number'
      );
      if (validBounds.length >= 3) {
        mapData.bounds = validBounds;
      }
    }

    if (color !== undefined) {
      mapData.color = {
        fill: color.fill,
        stroke: color.stroke
      };
    }

    // mapData'yı updateData'ya ekle
    if (Object.keys(mapData).length > 0) {
      updateData.mapData = mapData;
    }

    console.log('Updating with data:', JSON.stringify(updateData, null, 2));

    // Sadece geçerli veriler varsa güncelle
    if (Object.keys(updateData).length > 0) {
      await updateDoc(regionRef, updateData as DocumentData);
      console.log('Update successful');
      return NextResponse.json({ success: true });
    } else {
      console.log('No valid data to update');
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
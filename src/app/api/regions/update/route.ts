import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';

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
  additionalBounds?: number[][];
}

interface UpdateData {
  regionId: string;
  bounds?: number[];
  additionalBounds?: number[][];
  color?: {
    fill: string;
    stroke: string;
  };
  icons?: UpdateIcon[];
}

export async function POST(request: Request): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  try {
    const data: UpdateData = await request.json();
    console.log('Gelen istek verisi:', JSON.stringify(data, null, 2));

    const { regionId, bounds, additionalBounds, color, icons } = data;

    if (!regionId) {
      return NextResponse.json({ error: 'Region ID is required' }, { status: 400 });
    }

    const regionRef = doc(db, 'regions', regionId);
    const regionDoc = await getDoc(regionRef);

    if (!regionDoc.exists()) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }

    const currentData = regionDoc.data();
    console.log('Mevcut döküman verisi:', JSON.stringify(currentData, null, 2));

    // Temel güncelleme objesi
    const updateObj: Record<string, any> = {
      mapData: {}
    };

    // Mevcut mapData'yı al
    const currentMapData = currentData.mapData || {
      bounds: [],
      color: { fill: '', stroke: '' },
      center: [0, 0],
      additionalBounds: []
    };

    // Bounds güncellemesi
    if (bounds) {
      updateObj.mapData.bounds = bounds;
    } else {
      updateObj.mapData.bounds = currentMapData.bounds;
    }

    // Color güncellemesi
    if (color) {
      updateObj.mapData.color = color;
    } else {
      updateObj.mapData.color = currentMapData.color;
    }

    // Center güncellemesi
    updateObj.mapData.center = currentMapData.center || [150, 250];

    // Additional bounds güncellemesi
    if (additionalBounds && additionalBounds.length > 0) {
      console.log('Eklenecek yeni sınırlar:', JSON.stringify(additionalBounds, null, 2));
      
      // Mevcut additional bounds'ı al veya boş array oluştur
      const existingBounds = Array.isArray(currentMapData.additionalBounds) 
        ? currentMapData.additionalBounds 
        : [];
      
      console.log('Mevcut additional bounds:', JSON.stringify(existingBounds, null, 2));
      
      // Yeni bounds'ları ekle
      updateObj.mapData.additionalBounds = [...existingBounds];
      
      additionalBounds.forEach((bound, index) => {
        if (Array.isArray(bound) && bound.every(num => typeof num === 'number')) {
          console.log(`Eklenen sınır ${index}:`, JSON.stringify(bound, null, 2));
          updateObj.mapData.additionalBounds.push([...bound]);
        } else {
          throw new Error('Geçersiz sınır verisi formatı');
        }
      });
    } else {
      updateObj.mapData.additionalBounds = currentMapData.additionalBounds || [];
    }

    // İkonları güncelle
    if (icons) {
      updateObj.locations = icons;
    }

    console.log('Firestore\'a gönderilecek güncellenmiş veri:', JSON.stringify(updateObj, null, 2));

    await updateDoc(regionRef, updateObj);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Firestore güncelleme hatası:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Bölge güncellenirken bir hata oluştu'
    }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

interface UpdateIcon {
  name: string;
  type: string;
  coordinates: [number, number];
  color: string;
  description?: string | null;
  population?: string | null;
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

type FirestoreData = {
  mapData: {
    bounds: number[];
    color: {
      fill: string;
      stroke: string;
    };
    center: [number, number];
    additionalBounds: number[][];
  };
  locations?: UpdateIcon[];
};

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

    // Mevcut mapData'yı al
    const currentMapData = currentData.mapData || {
      bounds: [],
      color: { fill: '', stroke: '' },
      center: [0, 0],
      additionalBounds: []
    };

    // Güncelleme objesini oluştur
    const updateData: FirestoreData = {
      mapData: {
        bounds: bounds || currentMapData.bounds,
        color: color || currentMapData.color,
        center: currentMapData.center || [150, 250],
        additionalBounds: currentMapData.additionalBounds || []
      }
    };

    // Additional bounds güncellemesi
    if (additionalBounds && additionalBounds.length > 0) {
      console.log('Eklenecek yeni sınırlar:', JSON.stringify(additionalBounds, null, 2));
      
      // Mevcut additional bounds'ı al veya boş array oluştur
      const existingBounds = Array.isArray(currentMapData.additionalBounds) 
        ? currentMapData.additionalBounds 
        : [];
      
      console.log('Mevcut additional bounds:', JSON.stringify(existingBounds, null, 2));
      
      // Yeni bounds'ları ekle
      const newAdditionalBounds = [...existingBounds];
      
      additionalBounds.forEach((bound, index) => {
        if (Array.isArray(bound) && bound.every(num => typeof num === 'number')) {
          console.log(`Eklenen sınır ${index}:`, JSON.stringify(bound, null, 2));
          newAdditionalBounds.push([...bound]);
        } else {
          throw new Error('Geçersiz sınır verisi formatı');
        }
      });

      updateData.mapData.additionalBounds = newAdditionalBounds;
    }

    // İkonları güncelle
    if (icons) {
      updateData.locations = icons;
    }

    console.log('Firestore\'a gönderilecek güncellenmiş veri:', JSON.stringify(updateData, null, 2));

    await updateDoc(regionRef, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Firestore güncelleme hatası:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Bölge güncellenirken bir hata oluştu'
    }, { status: 500 });
  }
} 
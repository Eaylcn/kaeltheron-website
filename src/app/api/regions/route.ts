import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Region {
  id: string;
  name: string;
  description: string;
  image: string;
  type: string;
  climate: string;
  dominantRace: string;
  dangerLevel: number;
  features: string[];
  locations: Location[];
  mapData: MapData;
  resources: Resource[];
  threats: Threat[];
  travelTimes: TravelTime[];
  temperature?: Temperature;
}

interface Location {
  name: string;
  type: string;
  description?: string;
  population?: string;
  coordinates: [number, number];
  color: string;
}

interface MapData {
  bounds: [number, number][];
  center: [number, number];
  color?: {
    fill: string;
    stroke: string;
  };
}

interface Resource {
  name: string;
  type: string;
  rarity: string;
  description: string;
}

interface Threat {
  name: string;
  type: string;
  dangerLevel: number;
  description: string;
}

interface TravelTime {
  from: string;
  to: string;
  byHorse: string;
  byShip?: string;
}

interface Temperature {
  summer: string;
  winter: string;
}

interface RegionsResponse {
  regions: Record<string, Region>;
}

export async function GET(): Promise<NextResponse<RegionsResponse | { error: string }>> {
  try {
    const regionsCollection = collection(db, 'regions');
    const regionsSnapshot = await getDocs(regionsCollection);
    
    const regions: Record<string, Region> = {};
    
    regionsSnapshot.forEach((doc) => {
      try {
        const data = doc.data();
        // Veri dönüşümlerini ve validasyonunu yap
        const region: Region = {
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          image: data.image || '',
          type: data.type || '',
          climate: data.climate || '',
          dominantRace: data.dominantRace || '',
          dangerLevel: Number(data.dangerLevel) || 0,
          features: Array.isArray(data.features) ? data.features : [],
          locations: Array.isArray(data.locations) ? data.locations.map((loc: any) => ({
            name: loc.name || '',
            type: loc.type || '',
            description: loc.description,
            population: loc.population,
            coordinates: Array.isArray(loc.coordinates) ? loc.coordinates : [0, 0],
            color: loc.color || 'text-gray-400'
          })) : [],
          mapData: {
            bounds: Array.isArray(data.mapData?.bounds) ? data.mapData.bounds : [],
            center: Array.isArray(data.mapData?.center) ? data.mapData.center : [0, 0],
            color: data.mapData?.color || undefined
          },
          resources: Array.isArray(data.resources) ? data.resources : [],
          threats: Array.isArray(data.threats) ? data.threats : [],
          travelTimes: Array.isArray(data.travelTimes) ? data.travelTimes : [],
          temperature: data.temperature || undefined
        };
        
        regions[doc.id] = region;
      } catch (error) {
        console.error(`Bölge dönüşüm hatası (${doc.id}):`, error);
      }
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
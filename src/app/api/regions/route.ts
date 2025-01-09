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
      const data = doc.data() as Omit<Region, 'id'>;
      regions[doc.id] = { ...data, id: doc.id };
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
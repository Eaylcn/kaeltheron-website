import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface Point {
  x: number;
  y: number;
}

interface Location {
  name: string;
  type: string;
  coordinates: [number, number];
  color: string;
  description?: string;
  population?: string;
}

interface RegionColor {
  fill: string;
  stroke: string;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { regionId, bounds, icons, color } = data;

    if (!regionId) {
      return NextResponse.json(
        { error: 'Bölge ID gerekli' },
        { status: 400 }
      );
    }

    // regions.json dosyasını oku
    const regionsPath = path.join(process.cwd(), 'src/data/regions.json');
    const regionsContent = await fs.readFile(regionsPath, 'utf-8');
    const regionsData = JSON.parse(regionsContent);

    // Bölge var mı kontrol et
    if (!regionsData.regions[regionId]) {
      return NextResponse.json(
        { error: 'Bölge bulunamadı' },
        { status: 404 }
      );
    }

    // Değişiklikleri uygula
    if (!regionsData.regions[regionId].mapData) {
      regionsData.regions[regionId].mapData = {};
    }

    if (bounds && bounds.length > 0) {
      regionsData.regions[regionId].mapData.bounds = bounds.map((point: Point) => [point.x, point.y]);
    }

    // Renk değişikliği varsa kaydet
    if (color) {
      regionsData.regions[regionId].mapData.color = {
        fill: color.fill,
        stroke: color.stroke
      };
    }

    if (icons && icons.length > 0) {
      // Mevcut lokasyonları koru ama koordinatları güncelle
      const existingLocations = regionsData.regions[regionId].locations || [];
      const updatedLocations: Location[] = [];

      // Gelen ikonları ekle/güncelle
      icons.forEach((icon: Location) => {
        const existingLocation = existingLocations.find((loc: Location) => loc.name === icon.name);
        if (existingLocation) {
          // Mevcut lokasyonu güncelle
          updatedLocations.push({
            ...existingLocation,
            coordinates: icon.coordinates,
            type: icon.type,
            color: icon.color
          });
        } else {
          // Yeni lokasyon ekle
          updatedLocations.push({
            name: icon.name,
            type: icon.type,
            coordinates: icon.coordinates,
            color: icon.color
          });
        }
      });

      regionsData.regions[regionId].locations = updatedLocations;
    } else {
      // İkon yoksa locations dizisini boşalt
      regionsData.regions[regionId].locations = [];
    }

    // Değişiklikleri kaydet
    await fs.writeFile(
      regionsPath,
      JSON.stringify(regionsData, null, 2),
      'utf-8'
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bölge güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Bölge güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 
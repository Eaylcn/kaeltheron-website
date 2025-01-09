import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const regionsPath = path.join(process.cwd(), 'src/data/regions.json');
    const regionsContent = await fs.readFile(regionsPath, 'utf-8');
    const regionsData = JSON.parse(regionsContent);

    return NextResponse.json(regionsData);
  } catch (error) {
    console.error('Bölgeleri okuma hatası:', error);
    return NextResponse.json(
      { error: 'Bölgeler okunamadı' },
      { status: 500 }
    );
  }
} 
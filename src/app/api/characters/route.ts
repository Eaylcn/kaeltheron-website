import { getCharacters } from '@/utils/getCharacters';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = getCharacters();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load characters' }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import regionsData from '@/data/regions.json';

export async function GET() {
  return NextResponse.json(regionsData);
} 
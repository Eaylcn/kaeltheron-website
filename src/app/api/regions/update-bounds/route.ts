import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    // Token'ı al
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];

    // Token'ı doğrula ve kullanıcı bilgilerini al
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Kullanıcının admin olup olmadığını kontrol et
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();

    if (!userData?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Request body'den verileri al
    const { regionId, pathData } = await request.json();

    // Bölge sınırlarını güncelle
    await adminDb.collection('regions').doc(regionId).update({
      'mapData.path': pathData,
      updatedAt: new Date().toISOString(),
      updatedBy: uid
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating region bounds:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
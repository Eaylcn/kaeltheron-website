'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('./WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[800px] flex items-center justify-center bg-[#162137] rounded-lg">
      <div className="text-white text-xl font-risque">Harita Yükleniyor...</div>
    </div>
  )
});

export default function MapWrapper() {
  return (
    <Suspense fallback={
      <div className="w-full h-[800px] flex items-center justify-center bg-[#162137] rounded-lg">
        <div className="text-white text-xl font-risque">Harita Yükleniyor...</div>
      </div>
    }>
      <WorldMap />
    </Suspense>
  );
} 
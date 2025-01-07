'use client';

import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('./WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-xl bg-white/5 animate-pulse" />
  ),
});

const MapWrapper = () => {
  return <WorldMap />;
};

export default MapWrapper; 
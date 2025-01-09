'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaCity, FaFortAwesome, FaTree, FaMountain, FaSkull, FaSearchPlus, FaSearchMinus, FaCompass, FaPen, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { GiCastle, GiMiner, GiWoodCabin, GiPortal, GiAncientColumns } from 'react-icons/gi';
import Image from 'next/image';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import { useAuth } from '@/hooks/useAuth';
import { getAuth } from 'firebase/auth';
import toast from 'react-hot-toast';

interface Props {
  onRegionClick: (regionId: string) => void;
  selectedRegion: string | null;
}

// Kontrol paneli bileşeni
const Controls = ({ 
  isDrawing, 
  onDrawingToggle, 
  onClear, 
  onSave, 
  canSave 
}: { 
  isDrawing: boolean; 
  onDrawingToggle: () => void;
  onClear: () => void;
  onSave: () => void;
  canSave: boolean;
}) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute bottom-4 right-4 flex gap-2 bg-[#162137]/80 p-2 rounded-lg backdrop-blur-sm z-50">
      <button
        onClick={() => zoomIn()}
        className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
        title="Yakınlaştır"
      >
        <FaSearchPlus className="w-5 h-5" />
      </button>
      <button
        onClick={() => zoomOut()}
        className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
        title="Uzaklaştır"
      >
        <FaSearchMinus className="w-5 h-5" />
      </button>
      <button
        onClick={() => resetTransform()}
        className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
        title="Sıfırla"
      >
        <FaCompass className="w-5 h-5" />
      </button>
      <div className="w-px h-full bg-gray-600" />
      <button
        onClick={onDrawingToggle}
        className={`p-2 transition-colors ${
          isDrawing ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'
        }`}
        title={isDrawing ? 'Çizimi İptal Et' : 'Sınır Çiz'}
      >
        {isDrawing ? <FaTimes className="w-5 h-5" /> : <FaPen className="w-5 h-5" />}
      </button>
      {isDrawing && (
        <>
          <button
            onClick={onClear}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Temizle"
          >
            <FaTrash className="w-5 h-5" />
          </button>
          <button
            onClick={onSave}
            className={`p-2 transition-colors ${
              canSave ? 'text-gray-400 hover:text-green-500' : 'text-gray-600 cursor-not-allowed'
            }`}
            title="Kaydet"
            disabled={!canSave}
          >
            <FaSave className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};

const MapWrapper: React.FC<Props> = ({ onRegionClick, selectedRegion }) => {
  const [isZooming, setIsZooming] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<[number, number][]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const handleMapClick = (e: React.MouseEvent) => {
    if (!isDrawing || !mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPoints(prev => [...prev, [x, y]]);
  };

  const handleDrawingToggle = () => {
    if (!user?.isAdmin) {
      toast.error('Bu özelliği kullanmak için admin yetkisine sahip olmalısınız.');
      return;
    }
    setIsDrawing(!isDrawing);
    if (isDrawing) {
      setPoints([]);
    }
  };

  const handleClear = () => {
    setPoints([]);
  };

  const handleSave = async () => {
    if (points.length < 3 || !selectedRegion || !user?.isAdmin) return;

    try {
      setIsSaving(true);
      
      // SVG path verisi oluştur
      const pathData = points.reduce((path, point, i) => {
        return path + (i === 0 ? 'M' : 'L') + point[0] + ',' + point[1];
      }, '') + 'Z';

      // Firebase token al
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        throw new Error('Authentication token not found');
      }

      // API'ye gönder
      const response = await fetch('/api/regions/update-bounds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          regionId: selectedRegion,
          pathData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save region bounds');
      }

      toast.success('Bölge sınırları başarıyla kaydedildi');
      setPoints([]);
      setIsDrawing(false);
    } catch (error) {
      console.error('Error saving region bounds:', error);
      toast.error('Bölge sınırları kaydedilirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'castle': return <GiCastle className="w-6 h-6 text-amber-400" />;
      case 'city': return <FaCity className="w-6 h-6 text-blue-400" />;
      case 'fortress': return <FaFortAwesome className="w-6 h-6 text-red-400" />;
      case 'mine': return <GiMiner className="w-6 h-6 text-gray-400" />;
      case 'village': return <GiWoodCabin className="w-6 h-6 text-green-400" />;
      case 'portal': return <GiPortal className="w-6 h-6 text-purple-400" />;
      case 'sacred_site': return <GiAncientColumns className="w-6 h-6 text-yellow-400" />;
      default: return null;
    }
  };

  const getRegionIcon = (type: string) => {
    switch (type) {
      case 'forest': return <FaTree className="w-8 h-8 text-green-500" />;
      case 'mountain': return <FaMountain className="w-8 h-8 text-gray-400" />;
      case 'capital': return <FaCrown className="w-8 h-8 text-amber-400" />;
      case 'danger': return <FaSkull className="w-8 h-8 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="relative w-full h-[800px] bg-[#0B1120] rounded-lg overflow-hidden">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit
        onZoomStart={() => setIsZooming(true)}
        onZoom={() => setIsZooming(true)}
        wheel={{ step: 0.25 }}
        onPanning={() => setIsZooming(false)}
        doubleClick={{ mode: "reset" }}
        panning={{ velocityDisabled: true, disabled: isDrawing }}
      >
        {() => (
          <>
            {user?.isAdmin && (
              <Controls 
                isDrawing={isDrawing}
                onDrawingToggle={handleDrawingToggle}
                onClear={handleClear}
                onSave={handleSave}
                canSave={points.length >= 3 && !isSaving}
              />
            )}
            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="!w-full !h-full"
            >
              <div 
                ref={mapRef}
                className="relative w-full h-full"
                onClick={handleMapClick}
                style={{ cursor: isDrawing ? 'crosshair' : 'grab' }}
              >
                <div className="absolute inset-0">
                  <Image
                    src="/map-bg.jpg"
                    alt="Harita Arka Planı"
                    fill
                    className="object-cover object-center opacity-70"
                    priority
                    draggable={false}
                  />
                </div>

                {/* Çizim Katmanı */}
                {isDrawing && (
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {/* Çizilen Noktalar */}
                    {points.map((point, index) => (
                      <circle
                        key={index}
                        cx={point[0]}
                        cy={point[1]}
                        r="0.5"
                        fill="#FCD34D"
                      />
                    ))}
                    
                    {/* Çizilen Path */}
                    {points.length > 1 && (
                      <path
                        d={points.reduce((path, point, i) => {
                          return path + (i === 0 ? 'M' : 'L') + point[0] + ',' + point[1];
                        }, '') + (points.length >= 3 ? 'Z' : '')}
                        fill="rgba(252,211,77,0.15)"
                        stroke="#FCD34D"
                        strokeWidth="0.5"
                        strokeDasharray="2 1"
                      />
                    )}
                  </svg>
                )}
                
                {/* Mevcut Bölge Sınırları */}
                {!isDrawing && (
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {/* Eryndor Sınırları */}
                    <path
                      d="M25,35 Q30,40 35,45 T45,50 L40,55 Q35,50 30,45 Z"
                      fill="rgba(34,197,94,0.15)"
                      stroke="rgba(34,197,94,0.5)"
                      strokeWidth="0.8"
                      className={selectedRegion === 'eryndor' ? 'stroke-green-500' : ''}
                    />

                    {/* Anvilheim Sınırları */}
                    <path
                      d="M55,25 Q60,30 65,35 T75,40 L70,45 Q65,40 60,35 Z"
                      fill="rgba(156,163,175,0.15)"
                      stroke="rgba(156,163,175,0.5)"
                      strokeWidth="0.8"
                      className={selectedRegion === 'anvilheim' ? 'stroke-gray-400' : ''}
                    />
                  </svg>
                )}

                {/* Bölge ve Yerleşim İkonları */}
                {!isDrawing && (
                  <>
                    <motion.div
                      className="absolute cursor-pointer"
                      style={{ left: '30%', top: '40%' }}
                      whileHover={{ scale: isZooming ? 1 : 1.1 }}
                      onClick={() => onRegionClick('eryndor')}
                    >
                      <div className="relative">
                        {getRegionIcon('forest')}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-green-400 font-risque">
                          Eryndor Ormanları
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="absolute cursor-pointer"
                      style={{ left: '60%', top: '30%' }}
                      whileHover={{ scale: isZooming ? 1 : 1.1 }}
                      onClick={() => onRegionClick('anvilheim')}
                    >
                      <div className="relative">
                        {getRegionIcon('mountain')}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-gray-400 font-risque">
                          Anvilheim Zirvesi
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="absolute cursor-pointer"
                      style={{ left: '32%', top: '42%' }}
                      whileHover={{ scale: isZooming ? 1 : 1.1 }}
                    >
                      <div className="relative group">
                        {getLocationIcon('castle')}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-amber-400 font-risque opacity-0 group-hover:opacity-100 transition-opacity">
                          Silvermist Kalesi
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="absolute cursor-pointer"
                      style={{ left: '62%', top: '32%' }}
                      whileHover={{ scale: isZooming ? 1 : 1.1 }}
                    >
                      <div className="relative group">
                        {getLocationIcon('mine')}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-gray-400 font-risque opacity-0 group-hover:opacity-100 transition-opacity">
                          Derinkovuk
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default MapWrapper; 
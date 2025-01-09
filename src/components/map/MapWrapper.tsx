'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  FaCrown, FaCity, FaFortAwesome, FaTree, FaMountain, FaSkull, 
  FaSearchPlus, FaSearchMinus, FaCompass, FaPen, FaSave, FaUndo,
  FaMapMarker, FaMousePointer, FaDotCircle
} from 'react-icons/fa';
import { GiCastle, GiMiner, GiWoodCabin, GiPortal, GiAncientColumns } from 'react-icons/gi';
import Image from 'next/image';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';

interface MapWrapperProps {
  onRegionClick: (regionId: string) => void;
  selectedRegion: string | null;
}

interface Point {
  x: number;
  y: number;
}

interface Icon {
  id: string;
  type: string;
  position: Point;
  name: string;
  regionId: string;
  color: string;
}

interface RegionPath {
  id: string;
  path: string;
  color: {
    fill: string;
    stroke: string;
  };
}

interface IconType {
  id: string;
  name: string;
  color: string;
}

interface Region {
  id: string;
  name: string;
  type: string;
  mapData: {
    bounds: number[];
    color?: {
      fill: string;
      stroke: string;
    };
  };
  locations: Location[];
}

interface Location {
  name: string;
  type: string;
  coordinates: [number, number];
  color: string;
  description?: string;
  population?: string;
}

// Renk paleti
const colorPalette = [
  { name: 'Yeşil', fill: 'rgba(34,197,94,0.2)', stroke: 'rgba(34,197,94,0.7)' },
  { name: 'Mavi', fill: 'rgba(59,130,246,0.2)', stroke: 'rgba(59,130,246,0.7)' },
  { name: 'Kırmızı', fill: 'rgba(239,68,68,0.2)', stroke: 'rgba(239,68,68,0.7)' },
  { name: 'Mor', fill: 'rgba(168,85,247,0.2)', stroke: 'rgba(168,85,247,0.7)' },
  { name: 'Sarı', fill: 'rgba(234,179,8,0.2)', stroke: 'rgba(234,179,8,0.7)' },
  { name: 'Turuncu', fill: 'rgba(249,115,22,0.2)', stroke: 'rgba(249,115,22,0.7)' },
  { name: 'Gri', fill: 'rgba(156,163,175,0.2)', stroke: 'rgba(156,163,175,0.7)' },
  { name: 'Turkuaz', fill: 'rgba(20,184,166,0.2)', stroke: 'rgba(20,184,166,0.7)' },
  { name: 'Kahverengi', fill: 'rgba(78,34,6,0.2)', stroke: 'rgba(78,34,6,0.7)' },
  { name: 'Pembe', fill: 'rgba(236,72,153,0.2)', stroke: 'rgba(236,72,153,0.7)' },
  { name: 'Lacivert', fill: 'rgba(30,58,138,0.2)', stroke: 'rgba(30,58,138,0.7)' },
  { name: 'Altın', fill: 'rgba(234,179,8,0.2)', stroke: 'rgba(251,191,36,0.8)' }
];

const iconTypes: IconType[] = [
  { id: 'capital', name: 'Başkent', color: 'text-amber-500' },
  { id: 'castle', name: 'Kale', color: 'text-amber-500' },
  { id: 'city', name: 'Şehir', color: 'text-blue-500' },
  { id: 'fortress', name: 'Kale', color: 'text-red-500' },
  { id: 'mine', name: 'Maden', color: 'text-gray-300' },
  { id: 'village', name: 'Köy', color: 'text-green-500' },
  { id: 'portal', name: 'Portal', color: 'text-purple-500' },
  { id: 'sacred_site', name: 'Kutsal Alan', color: 'text-yellow-500' },
];

const iconColors = [
  { id: 'amber', name: 'Altın', class: 'text-amber-500' },
  { id: 'blue', name: 'Mavi', class: 'text-blue-500' },
  { id: 'red', name: 'Kırmızı', class: 'text-red-500' },
  { id: 'green', name: 'Yeşil', class: 'text-green-500' },
  { id: 'purple', name: 'Mor', class: 'text-purple-500' },
  { id: 'yellow', name: 'Sarı', class: 'text-yellow-500' },
  { id: 'gray', name: 'Gri', class: 'text-gray-300' },
  { id: 'white', name: 'Beyaz', class: 'text-white' },
];

// Kontrol paneli bileşeni
const Controls = ({ 
  isEditMode, 
  onEditClick, 
  onSaveClick,
  editMode,
  setEditMode,
  selectedColor,
  setSelectedColor,
  onUndoClick,
  canUndo,
  selectedIconType,
  setSelectedIconType,
  iconName,
  setIconName,
  onAddIcon,
  selectedIconColor,
  setSelectedIconColor
}: {
  isEditMode: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
  editMode: 'draw' | 'move' | 'add' | 'delete' | null;
  setEditMode: (mode: 'draw' | 'move' | 'add' | 'delete' | null) => void;
  selectedColor: number;
  setSelectedColor: (index: number) => void;
  onUndoClick: () => void;
  canUndo: boolean;
  selectedIconType: string;
  setSelectedIconType: (type: string) => void;
  iconName: string;
  setIconName: (name: string) => void;
  onAddIcon: () => void;
  selectedIconColor: string;
  setSelectedIconColor: (color: string) => void;
}) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-50">
      {/* Ana kontroller */}
      <div className="flex gap-2 bg-[#162137]/80 p-2 rounded-lg backdrop-blur-sm">
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
        <div className="w-[1px] bg-gray-600" />
        <button
          onClick={onEditClick}
          className={`p-2 transition-colors ${
            isEditMode ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'
          }`}
          title="Düzenle"
        >
          <FaPen className="w-5 h-5" />
        </button>
      </div>

      {/* Edit mode kontrolleri */}
      {isEditMode && (
        <div className="flex flex-col gap-2">
          <div className="bg-[#162137]/80 p-2 rounded-lg backdrop-blur-sm">
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setEditMode('draw')}
                className={`p-2 rounded transition-colors ${
                  editMode === 'draw' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-amber-500'
                }`}
                title="Sınır Çiz"
              >
                <FaDotCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => setEditMode('move')}
                className={`p-2 rounded transition-colors ${
                  editMode === 'move' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-amber-500'
                }`}
                title="İkonları Taşı"
              >
                <FaMousePointer className="w-5 h-5" />
              </button>
              <button
                onClick={() => setEditMode('add')}
                className={`p-2 rounded transition-colors ${
                  editMode === 'add' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-amber-500'
                }`}
                title="İkon Ekle"
              >
                <FaMapMarker className="w-5 h-5" />
              </button>
              <button
                onClick={() => setEditMode('delete')}
                className={`p-2 rounded transition-colors ${
                  editMode === 'delete' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-red-500'
                }`}
                title="İkon Sil"
              >
                <FaSkull className="w-5 h-5" />
              </button>
              <button
                onClick={onSaveClick}
                className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
                title="Kaydet"
              >
                <FaSave className="w-5 h-5" />
              </button>
            </div>

            {editMode === 'draw' && (
              <>
                <div className="grid grid-cols-4 gap-1 mb-2">
                  {colorPalette.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`w-8 h-8 rounded transition-all ${
                        selectedColor === index ? 'ring-2 ring-amber-500 scale-110' : ''
                      }`}
                      style={{ background: color.stroke }}
                    />
                  ))}
                </div>
                <button
                  onClick={onUndoClick}
                  disabled={!canUndo}
                  className={`w-full p-2 rounded text-sm ${
                    canUndo 
                      ? 'text-amber-500 hover:bg-amber-500/10' 
                      : 'text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <FaUndo className="inline mr-2" />
                  Son Noktayı Geri Al
                </button>
              </>
            )}

            {editMode === 'add' && (
              <div className="flex flex-col gap-2 mt-2">
                <select
                  value={selectedIconType}
                  onChange={(e) => setSelectedIconType(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-gray-200 border border-gray-700"
                >
                  <option value="">İkon Tipi Seçin</option>
                  {iconTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                <select
                  value={selectedIconColor}
                  onChange={(e) => setSelectedIconColor(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-gray-200 border border-gray-700"
                >
                  <option value="">İkon Rengi Seçin</option>
                  {iconColors.map(color => (
                    <option key={color.id} value={color.class}>{color.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  placeholder="İkon İsmi"
                  className="w-full p-2 rounded bg-gray-800 text-gray-200 border border-gray-700"
                />
                <button
                  onClick={onAddIcon}
                  disabled={!selectedIconType || !iconName || !selectedIconColor}
                  className={`w-full p-2 rounded text-sm ${
                    selectedIconType && iconName && selectedIconColor
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  İkon Ekle
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function MapWrapper({ onRegionClick, selectedRegion }: MapWrapperProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editMode, setEditMode] = useState<'draw' | 'move' | 'add' | 'delete' | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [regionPaths, setRegionPaths] = useState<RegionPath[]>([]);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIconType, setSelectedIconType] = useState('');
  const [iconName, setIconName] = useState('');
  const [pendingIcon, setPendingIcon] = useState<{ x: number; y: number } | null>(null);
  const [selectedIconColor, setSelectedIconColor] = useState('');

  // Başlangıç verilerini yükle
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const response = await fetch('/api/regions');
        if (!response.ok) throw new Error('Bölgeler yüklenemedi');
        
        const data = await response.json();
        
        // Region paths'i oluştur
        const paths: RegionPath[] = Object.values(data.regions)
          .filter((region) => {
            const typedRegion = region as Region;
            return typedRegion && typedRegion.mapData && Array.isArray(typedRegion.mapData.bounds);
          })
          .map((region) => {
            const typedRegion = region as Region;
            const bounds = typedRegion.mapData.bounds;
            let path = '';
            
            if (bounds && bounds.length >= 6) { // En az 3 nokta için 6 koordinat gerekli
              // Düz array'i koordinat çiftlerine dönüştür
              const coordinates = [];
              for (let i = 0; i < bounds.length; i += 2) {
                if (typeof bounds[i] === 'number' && typeof bounds[i + 1] === 'number') {
                  coordinates.push([bounds[i], bounds[i + 1]]);
                }
              }

              if (coordinates.length >= 3) {
                path = `M ${coordinates.map((p) => `${p[0]},${p[1]}`).join(' L ')} Z`;
              }
            }
            
            // Geçerli bir path yoksa varsayılan oluştur
            if (!path) {
              const centerX = 50;
              const centerY = 50;
              const size = 5;
              path = `M ${centerX-size},${centerY-size} L ${centerX+size},${centerY-size} L ${centerX+size},${centerY+size} L ${centerX-size},${centerY+size} Z`;
            }

            // Kaydedilmiş rengi kullan veya varsayılan rengi ata
            const color = typedRegion.mapData?.color || {
              fill: 'rgba(156,163,175,0.15)',
              stroke: 'rgba(156,163,175,0.5)'
            };

            return { id: typedRegion.id, path, color };
          });

        // İkonları yükle
        const allIcons: Icon[] = [];
        Object.values(data.regions).forEach((region) => {
          const typedRegion = region as Region;
          if (typedRegion.locations && Array.isArray(typedRegion.locations)) {
            typedRegion.locations.forEach((location) => {
              if (location && Array.isArray(location.coordinates)) {
                allIcons.push({
                  id: `${typedRegion.id}-${location.name.toLowerCase().replace(/\s+/g, '-')}`,
                  type: location.type,
                  position: { 
                    x: location.coordinates[0], 
                    y: location.coordinates[1] 
                  },
                  name: location.name,
                  regionId: typedRegion.id,
                  color: location.color || 'text-gray-400'
                });
              }
            });
          }
        });

        console.log('Loaded paths:', paths);
        console.log('Loaded icons:', allIcons);
        setRegionPaths(paths);
        setIcons(allIcons);
        setIsLoading(false);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
        setIsLoading(false);
      }
    };

    loadRegions();
  }, []);

  const getLocationIcon = (type: string, color: string = 'text-gray-400') => {
    switch (type) {
      case 'capital': return <FaCrown className={`w-6 h-6 ${color}`} />;
      case 'castle': return <GiCastle className={`w-6 h-6 ${color}`} />;
      case 'city': return <FaCity className={`w-6 h-6 ${color}`} />;
      case 'fortress': return <FaFortAwesome className={`w-6 h-6 ${color}`} />;
      case 'mine': return <GiMiner className={`w-6 h-6 ${color}`} />;
      case 'village': return <GiWoodCabin className={`w-6 h-6 ${color}`} />;
      case 'portal': return <GiPortal className={`w-6 h-6 ${color}`} />;
      case 'sacred_site': return <GiAncientColumns className={`w-6 h-6 ${color}`} />;
      case 'forest': return <FaTree className={`w-8 h-8 ${color}`} />;
      case 'mountain': return <FaMountain className={`w-8 h-8 ${color}`} />;
      default: return null;
    }
  };

  const handleMapClick = useCallback((e: React.MouseEvent) => {
    if (!isEditMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    if (editMode === 'draw') {
      setDrawingPoints(prev => [...prev, { x, y }]);
    } else if (editMode === 'add' && selectedIconType && iconName) {
      setPendingIcon({ x, y });
    }
  }, [isEditMode, editMode, selectedIconType, iconName]);

  const handleIconMouseDown = (e: React.MouseEvent, icon: Icon) => {
    if (!isEditMode || editMode !== 'move') return;
    e.stopPropagation();
    setSelectedIcon(icon);
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedIcon) return;
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setIcons(prev => prev.map(icon => 
      icon.id === selectedIcon.id
        ? { ...icon, position: { x, y } }
        : icon
    ));
  }, [isDragging, selectedIcon]);

  const handleMouseUp = async (e: React.MouseEvent) => {
    if (isDragging && selectedIcon) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const updatedIcons = icons.map(icon =>
        icon.id === selectedIcon.id
          ? { ...icon, position: { x, y } }
          : icon
      );

      setIcons(updatedIcons);

      try {
        const response = await fetch('/api/regions/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            regionId: selectedRegion,
            icons: updatedIcons
              .filter(icon => icon.regionId === selectedRegion)
              .map(icon => ({
                name: icon.name,
                type: icon.type,
                coordinates: [icon.position.x, icon.position.y],
                color: icon.color
              }))
          }),
        });

        if (!response.ok) throw new Error('İkon konumu güncellenemedi');
      } catch (error) {
        console.error('İkon güncelleme hatası:', error);
      }
    }
    
    setIsDragging(false);
    setSelectedIcon(null);
  };

  const handleSave = async () => {
    if (!selectedRegion) return;

    try {
      const updateData: {
        regionId: string;
        bounds?: number[];
        color?: {
          name?: string;
          fill: string;
          stroke: string;
        };
        icons?: {
          name: string;
          type: string;
          coordinates: [number, number];
          color: string;
          description?: string | null;
          population?: string | null;
        }[];
      } = { regionId: selectedRegion };
      
      if (editMode === 'draw' && drawingPoints.length >= 3) {
        const newColor = colorPalette[selectedColor];
        
        // Önce state'i güncelle
        const newPath = getPathFromPoints();
        setRegionPaths(prev => prev.map(rp => 
          rp.id === selectedRegion
            ? { ...rp, path: newPath, color: newColor }
            : rp
        ));

        // Sınırları ve rengi ekle
        updateData.bounds = drawingPoints.map(p => p.x).concat(drawingPoints.map(p => p.y));
        updateData.color = newColor;
      }

      // İkonları ekle
      const regionIcons = icons.filter(icon => icon.regionId === selectedRegion);
      if (regionIcons.length > 0) {
        updateData.icons = regionIcons.map(icon => ({
          name: icon.name,
          type: icon.type,
          coordinates: [icon.position.x, icon.position.y] as [number, number],
          color: icon.color
        }));
      }

      console.log('Sending update data:', updateData);

      const response = await fetch('/api/regions/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      console.log('Update response:', result);

      if (!response.ok) {
        throw new Error('Kaydetme başarısız: ' + (result.error || 'Bilinmeyen hata'));
      }

      console.log('Bölge başarıyla güncellendi:', updateData);
      
      setIsEditMode(false);
      setEditMode(null);
      setDrawingPoints([]);
      onRegionClick(''); // Bölge seçimini kaldır
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Bölge kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleUndo = () => {
    setDrawingPoints(prev => prev.slice(0, -1));
  };

  const getPathFromPoints = () => {
    if (drawingPoints.length < 2) return '';
    return `M ${drawingPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
  };

  const handleRegionClick = (event: React.MouseEvent<SVGPathElement>, regionId: string) => {
    event.stopPropagation();
    onRegionClick(regionId);
  };

  const handleAddIcon = async () => {
    if (!pendingIcon || !selectedRegion || !selectedIconColor) return;

    const newIcon: Icon = {
      id: `${selectedRegion}-${iconName.toLowerCase().replace(/\s+/g, '-')}`,
      type: selectedIconType,
      position: pendingIcon,
      name: iconName,
      regionId: selectedRegion,
      color: selectedIconColor
    };

    const updatedIcons = [...icons, newIcon];
    setIcons(updatedIcons);

    try {
      const response = await fetch('/api/regions/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          regionId: selectedRegion,
          icons: updatedIcons
            .filter(icon => icon.regionId === selectedRegion)
            .map(icon => ({
              name: icon.name,
              type: icon.type,
              coordinates: [icon.position.x, icon.position.y],
              color: icon.color
            }))
        }),
      });

      if (!response.ok) throw new Error('İkon kaydetme başarısız');
    } catch (error) {
      console.error('İkon kaydetme hatası:', error);
    }

    setPendingIcon(null);
    setSelectedIconType('');
    setIconName('');
    setSelectedIconColor('');
  };

  const handleIconDelete = async (iconId: string) => {
    const updatedIcons = icons.filter(icon => icon.id !== iconId);
    setIcons(updatedIcons);
    
    const deletedIcon = icons.find(icon => icon.id === iconId);
    if (deletedIcon && selectedRegion) {
      try {
        const response = await fetch('/api/regions/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            regionId: selectedRegion,
            icons: updatedIcons
              .filter(icon => icon.regionId === selectedRegion)
              .map(icon => ({
                name: icon.name,
                type: icon.type,
                coordinates: [icon.position.x, icon.position.y],
                color: icon.color
              }))
          }),
        });

        if (!response.ok) throw new Error('Silme işlemi kaydedilemedi');
      } catch (error) {
        console.error('Silme hatası:', error);
      }
    }
  };

  const handleIconClick = (e: React.MouseEvent, icon: Icon) => {
    e.stopPropagation();
    if (isEditMode && editMode === 'delete') {
      handleIconDelete(icon.id);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setSelectedIcon(null);
      setSelectedIcon(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as unknown as EventListener);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove as unknown as EventListener);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  return (
    <div className="relative w-full h-[800px] bg-[#0B1120] rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-amber-500">Yükleniyor...</div>
        </div>
      ) : (
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={4}
          centerOnInit
          wheel={{ step: 0.25 }}
          panning={{ velocityDisabled: true, disabled: isEditMode && editMode === 'draw' }}
        >
          {() => (
            <>
              <Controls 
                isEditMode={isEditMode}
                onEditClick={() => {
                  if (!selectedRegion) {
                    alert('Lütfen önce bir bölge seçin');
                    return;
                  }
                  setIsEditMode(!isEditMode);
                }}
                onSaveClick={handleSave}
                editMode={editMode}
                setEditMode={setEditMode}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                onUndoClick={handleUndo}
                canUndo={drawingPoints.length > 0}
                selectedIconType={selectedIconType}
                setSelectedIconType={setSelectedIconType}
                iconName={iconName}
                setIconName={setIconName}
                onAddIcon={handleAddIcon}
                selectedIconColor={selectedIconColor}
                setSelectedIconColor={setSelectedIconColor}
              />
              <TransformComponent
                wrapperClass="!w-full !h-full"
                contentClass="!w-full !h-full"
              >
                <div 
                  className="relative w-full h-full"
                  onClick={handleMapClick}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
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

                  {/* Çizim alanı */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {/* Mevcut bölge sınırları */}
                    {regionPaths.map(region => {
                      // Edit modunda sadece seçili bölgeyi göster
                      if (isEditMode && region.id !== selectedRegion) return null;
                      
                      return (
                        <path
                          key={region.id}
                          d={region.path}
                          fill={region.color.fill}
                          stroke={region.color.stroke}
                          strokeWidth="0.4"
                          className={`transition-colors ${
                            !isEditMode ? 'cursor-pointer hover:stroke-amber-500' : ''
                          } ${selectedRegion === region.id ? 'stroke-amber-500' : ''}`}
                          onClick={(event) => handleRegionClick(event, region.id)}
                          style={{ pointerEvents: !isEditMode ? 'all' : 'none' }}
                        />
                      );
                    })}

                    {/* Çizim modu aktif sınır */}
                    {isEditMode && editMode === 'draw' && drawingPoints.length > 0 && (
                      <path
                        d={getPathFromPoints()}
                        fill={colorPalette[selectedColor].fill}
                        stroke={colorPalette[selectedColor].stroke}
                        strokeWidth="0.4"
                      />
                    )}

                    {/* Çizim noktaları */}
                    {isEditMode && editMode === 'draw' && drawingPoints.map((point, index) => (
                      <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="0.3"
                        fill={colorPalette[selectedColor].stroke}
                      />
                    ))}
                  </svg>

                  {/* İkonlar */}
                  {icons.map(icon => {
                    // Edit modunda sadece seçili bölgenin ikonlarını göster
                    if (isEditMode && icon.regionId !== selectedRegion) return null;
                    
                    const isCapital = icon.type === 'capital';
                    
                    return (
                      <div
                        key={icon.id}
                        className={`absolute ${
                          isEditMode ? (
                            editMode === 'move' 
                              ? 'cursor-move' 
                              : editMode === 'delete'
                              ? 'cursor-pointer hover:scale-125 hover:text-red-500'
                              : ''
                          ) : 'cursor-pointer'
                        } transition-all duration-200 ${
                          isCapital 
                            ? 'hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                            : 'hover:scale-110'
                        }`}
                        style={{ 
                          left: `${icon.position.x}%`, 
                          top: `${icon.position.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onMouseDown={(e) => editMode === 'move' ? handleIconMouseDown(e, icon) : null}
                        onClick={(e) => handleIconClick(e, icon)}
                      >
                        <div className="relative group">
                          {getLocationIcon(icon.type, editMode === 'delete' ? 'text-red-500' : icon.color)}
                          <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm ${
                            editMode === 'delete' ? 'text-red-500' : icon.color || 'text-gray-400'
                          } font-risque ${
                            isCapital ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          } transition-opacity duration-200`}>
                            {icon.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Bekleyen İkon */}
                  {editMode === 'add' && pendingIcon && (
                    <div
                      className={`absolute pointer-events-none ${
                        selectedIconType === 'capital' 
                          ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]' 
                          : ''
                      }`}
                      style={{ 
                        left: `${pendingIcon.x}%`, 
                        top: `${pendingIcon.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="relative">
                        {getLocationIcon(selectedIconType, selectedIconColor)}
                        <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm ${
                          selectedIconColor || 'text-gray-400'
                        } font-risque`}>
                          {iconName}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      )}
      </div>
  );
} 
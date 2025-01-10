'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  FaCrown, FaCity, FaFortAwesome, FaTree, FaMountain
} from 'react-icons/fa';
import { GiCastle, GiMiner, GiWoodCabin, GiPortal, GiAncientColumns } from 'react-icons/gi';
import Image from 'next/image';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface MapWrapperProps {
  onRegionClick: (regionId: string) => void;
  selectedRegion: string | null;
  onLocationsUpdate?: (regionId: string) => void;
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
  additionalPaths?: string[];
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
    additionalBounds?: number[][];
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
  { fill: 'rgba(245, 158, 11, 0.2)', stroke: 'rgb(245, 158, 11)' }, // Amber
  { fill: 'rgba(239, 68, 68, 0.2)', stroke: 'rgb(239, 68, 68)' }, // Red
  { fill: 'rgba(59, 130, 246, 0.2)', stroke: 'rgb(59, 130, 246)' }, // Blue
  { fill: 'rgba(16, 185, 129, 0.2)', stroke: 'rgb(16, 185, 129)' }, // Green
  { fill: 'rgba(139, 92, 246, 0.2)', stroke: 'rgb(139, 92, 246)' }, // Purple
  { fill: 'rgba(236, 72, 153, 0.2)', stroke: 'rgb(236, 72, 153)' }, // Pink
  { fill: 'rgba(99, 102, 241, 0.2)', stroke: 'rgb(99, 102, 241)' }, // Indigo
  { fill: 'rgba(249, 115, 22, 0.2)', stroke: 'rgb(249, 115, 22)' }, // Orange
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
  setSelectedIconColor,
  colors,
  setColors,
  iconColors,
  setIconColors,
  selectedRegion,
  setRegionPaths,
  selectedIconForEdit,
  handleUpdateIcon,
  setIsEditMode,
  setDrawingPoints
}: {
  isEditMode: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
  editMode: 'draw' | 'move' | 'add' | 'delete' | 'color' | 'edit_icon' | 'add_bounds' | null;
  setEditMode: (mode: 'draw' | 'move' | 'add' | 'delete' | 'color' | 'edit_icon' | 'add_bounds' | null) => void;
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
  colors: { fill: string; stroke: string }[];
  setColors: React.Dispatch<React.SetStateAction<{ fill: string; stroke: string }[]>>;
  iconColors: string[];
  setIconColors: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRegion: string | null;
  setRegionPaths: React.Dispatch<React.SetStateAction<RegionPath[]>>;
  selectedIconForEdit: Icon | null;
  handleUpdateIcon: () => void;
  setIsEditMode: (isEdit: boolean) => void;
  setDrawingPoints: React.Dispatch<React.SetStateAction<Point[]>>;
}) => {
  const [customColor, setCustomColor] = useState(colors[0].stroke);
  const [customIconColor, setCustomIconColor] = useState(iconColors[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconColorPicker, setShowIconColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState<{ fill: string; stroke: string } | null>(null);
  const [tempIconColor, setTempIconColor] = useState<string | null>(null);

  // Hex'ten RGB'ye dönüşüm fonksiyonu
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  // Renk seçici dışında bir yere tıklandığında kapanması için
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.color-picker-container')) {
        if (showColorPicker) {
          setShowColorPicker(false);
          if (tempColor) {
            const newColors = [...colors, tempColor];
            setColors(newColors);
            setSelectedColor(newColors.length - 1);
            setTempColor(null);
          }
        }
        if (showIconColorPicker) {
          setShowIconColorPicker(false);
          if (tempIconColor && !iconColors.includes(tempIconColor)) {
            const newIconColors = [...iconColors, tempIconColor];
            setIconColors(newIconColors);
            setSelectedIconColor(tempIconColor);
            setTempIconColor(null);
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPicker, showIconColorPicker, tempColor, tempIconColor, colors, iconColors, setColors, setIconColors, setSelectedColor, setSelectedIconColor]);

  return (
    <div className="absolute top-4 left-4 z-[1000] space-y-2">
      {!isEditMode ? (
        <button
          onClick={onEditClick}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors font-risque"
        >
          Düzenle
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={onSaveClick}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-risque"
            >
              Kaydet
            </button>
            <button
              onClick={() => {
                setIsEditMode(false);
                setEditMode(null);
                setDrawingPoints([]);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-risque"
            >
              İptal
            </button>
            {canUndo && (
              <button
                onClick={onUndoClick}
                className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
            )}
          </div>

          <div className="bg-[#162137] p-4 rounded-lg space-y-4">
            {/* Menü Başlıkları */}
            <div className="flex gap-2">
              <button
                onClick={() => setEditMode(editMode === 'draw' || editMode === 'add_bounds' || editMode === 'color' ? null : 'draw')}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors font-risque ${
                  (editMode === 'draw' || editMode === 'add_bounds' || editMode === 'color') ? 'bg-amber-500 text-white' : 'bg-[#1C2B4B] text-gray-400 hover:text-amber-500'
                }`}
              >
                Sınır
              </button>
              <button
                onClick={() => setEditMode(editMode === 'add' || editMode === 'edit_icon' || editMode === 'delete' ? null : 'add')}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors font-risque ${
                  (editMode === 'add' || editMode === 'edit_icon' || editMode === 'delete') ? 'bg-amber-500 text-white' : 'bg-[#1C2B4B] text-gray-400 hover:text-amber-500'
                }`}
              >
                İkon
              </button>
            </div>

            {/* Sınır İşlemleri */}
            {(editMode === 'draw' || editMode === 'add_bounds' || editMode === 'color') && (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-1">
                  <button
                    onClick={() => setEditMode('draw')}
                    className={`px-4 py-2 rounded-lg transition-colors font-risque ${
                      editMode === 'draw' ? 'bg-amber-500 text-white' : 'bg-[#1C2B4B] text-gray-400 hover:text-amber-500'
                    }`}
                  >
                    Sınır Çiz
                  </button>
                  <button
                    onClick={() => setEditMode('add_bounds')}
                    className={`px-4 py-2 rounded-lg transition-colors font-risque ${
                      editMode === 'add_bounds' ? 'bg-amber-500 text-white' : 'bg-[#1C2B4B] text-gray-400 hover:text-amber-500'
                    }`}
                  >
                    Ek Sınır
                  </button>
                  <button
                    onClick={() => setEditMode('color')}
                    className={`px-4 py-2 rounded-lg transition-colors font-risque ${
                      editMode === 'color' ? 'bg-amber-500 text-white' : 'bg-[#1C2B4B] text-gray-400 hover:text-amber-500'
                    }`}
                  >
                    Renk
                  </button>
                </div>

                {(editMode === 'draw' || editMode === 'color') && (
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-risque">Bölge Rengi</label>
                    <div className="grid grid-cols-8 gap-1">
                      {colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedColor(index);
                            setTempColor(null);
                            if (editMode === 'color' && selectedRegion) {
                              setRegionPaths(prev => prev.map(rp => 
                                rp.id === selectedRegion
                                  ? { ...rp, color: colors[index] }
                                  : rp
                              ));
                            }
                          }}
                          className={`w-8 h-8 rounded-lg border-2 transition-all ${
                            (selectedColor === index && !tempColor) ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.stroke }}
                        />
                      ))}
                      <div className="relative color-picker-container">
                        <button
                          onClick={() => setShowColorPicker(!showColorPicker)}
                          className={`w-8 h-8 rounded-lg border-2 border-dashed transition-all flex items-center justify-center ${
                            tempColor ? 'border-white scale-110' : 'border-gray-400 hover:border-white'
                          }`}
                          style={{ backgroundColor: customColor }}
                        >
                          <span className="text-gray-400 text-xl">+</span>
                        </button>
                        {showColorPicker && (
                          <div className="absolute top-full left-0 mt-1 z-50">
                            <input
                              type="color"
                              value={customColor}
                              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                const newColor = e.currentTarget.value;
                                const rgb = hexToRgb(newColor);
                                const newColorObj = {
                                  fill: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
                                  stroke: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
                                };
                                setCustomColor(newColor);
                                setTempColor(newColorObj);
                                if (editMode === 'color' && selectedRegion) {
                                  setRegionPaths(prev => prev.map(rp => 
                                    rp.id === selectedRegion
                                      ? { ...rp, color: newColorObj }
                                      : rp
                                  ));
                                }
                              }}
                              className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* İkon İşlemleri */}
            {(editMode === 'add' || editMode === 'edit_icon' || editMode === 'delete') && (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setEditMode('add')}
                    className={`px-4 py-2 rounded-lg transition-colors font-risque ${
                      editMode === 'add' ? 'bg-amber-500 text-white' : 'bg-[#1C2B4B] text-gray-400 hover:text-amber-500'
                    }`}
                  >
                    Ekle
                  </button>
                  <button
                    onClick={() => setEditMode('edit_icon')}
                    className={`px-4 py-2 rounded-lg transition-colors font-risque ${
                      editMode === 'edit_icon' ? 'bg-amber-500 text-white' : 'bg-[#1C2B4B] text-gray-400 hover:text-amber-500'
                    }`}
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => setEditMode('delete')}
                    className={`px-4 py-2 rounded-lg transition-colors font-risque ${
                      editMode === 'delete' ? 'bg-amber-500 text-white' : 'bg-[#1C2B4B] text-gray-400 hover:text-amber-500'
                    }`}
                  >
                    Sil
                  </button>
                </div>

                {(editMode === 'add' || editMode === 'edit_icon') && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm font-risque block mb-1">İkon Tipi</label>
                      <select
                        value={selectedIconType}
                        onChange={(e) => setSelectedIconType(e.target.value)}
                        className="w-full bg-[#1C2B4B] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="">Seçiniz...</option>
                        <option value="capital">Başkent</option>
                        <option value="city">Şehir</option>
                        <option value="castle">Kale</option>
                        <option value="fortress">Kale (Küçük)</option>
                        <option value="village">Köy</option>
                        <option value="mine">Maden</option>
                        <option value="portal">Portal</option>
                        <option value="sacred_site">Kutsal Alan</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm font-risque block mb-1">İkon Rengi</label>
                      <div className="grid grid-cols-8 gap-1">
                        {iconColors.map((color, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedIconColor(color);
                              setTempIconColor(null);
                            }}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${
                              (selectedIconColor === color && !tempIconColor) ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <div className="relative color-picker-container">
                          <button
                            onClick={() => setShowIconColorPicker(!showIconColorPicker)}
                            className={`w-8 h-8 rounded-lg border-2 border-dashed transition-all flex items-center justify-center ${
                              tempIconColor ? 'border-white scale-110' : 'border-gray-400 hover:border-white'
                            }`}
                            style={{ backgroundColor: customIconColor }}
                          >
                            <span className="text-gray-400 text-xl">+</span>
                          </button>
                          {showIconColorPicker && (
                            <div className="absolute top-full left-0 mt-1 z-50">
                              <input
                                type="color"
                                value={customIconColor}
                                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                  const newColor = e.currentTarget.value;
                                  const rgb = hexToRgb(newColor);
                                  const rgbColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                                  setCustomIconColor(newColor);
                                  setTempIconColor(rgbColor);
                                  setSelectedIconColor(rgbColor);
                                }}
                                className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm font-risque block mb-1">İsim</label>
                      <input
                        type="text"
                        value={iconName}
                        onChange={(e) => setIconName(e.target.value)}
                        className="w-full bg-[#1C2B4B] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Yerleşim ismi..."
                      />
                    </div>

                    <button
                      onClick={editMode === 'add' ? onAddIcon : handleUpdateIcon}
                      disabled={!selectedIconType || !iconName}
                      className="w-full bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors font-risque disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {editMode === 'add' ? 'Ekle' : 'Güncelle'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function MapWrapper({ onRegionClick, selectedRegion, onLocationsUpdate }: MapWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editMode, setEditMode] = useState<'draw' | 'move' | 'add' | 'delete' | 'color' | 'edit_icon' | 'add_bounds' | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedIconType, setSelectedIconType] = useState('');
  const [selectedIconColor, setSelectedIconColor] = useState('');
  const [iconName, setIconName] = useState('');
  const [pendingIcon, setPendingIcon] = useState<Point | null>(null);
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [regionPaths, setRegionPaths] = useState<RegionPath[]>([]);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [selectedIconForEdit, setSelectedIconForEdit] = useState<Icon | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sabit renk paleti
  const defaultColors = [
    { fill: 'rgba(245, 158, 11, 0.2)', stroke: 'rgb(245, 158, 11)' }, // Amber
    { fill: 'rgba(239, 68, 68, 0.2)', stroke: 'rgb(239, 68, 68)' }, // Red
    { fill: 'rgba(59, 130, 246, 0.2)', stroke: 'rgb(59, 130, 246)' }, // Blue
    { fill: 'rgba(16, 185, 129, 0.2)', stroke: 'rgb(16, 185, 129)' }, // Green
    { fill: 'rgba(139, 92, 246, 0.2)', stroke: 'rgb(139, 92, 246)' }, // Purple
    { fill: 'rgba(236, 72, 153, 0.2)', stroke: 'rgb(236, 72, 153)' }, // Pink
    { fill: 'rgba(99, 102, 241, 0.2)', stroke: 'rgb(99, 102, 241)' }, // Indigo
    { fill: 'rgba(249, 115, 22, 0.2)', stroke: 'rgb(249, 115, 22)' }, // Orange
  ];

  const defaultIconColors = [
    'rgb(245, 158, 11)', // Amber
    'rgb(239, 68, 68)', // Red
    'rgb(59, 130, 246)', // Blue
    'rgb(16, 185, 129)', // Green
    'rgb(139, 92, 246)', // Purple
    'rgb(236, 72, 153)', // Pink
    'rgb(99, 102, 241)', // Indigo
    'rgb(249, 115, 22)', // Orange
  ];

  const [colors, setColors] = useState(defaultColors);
  const [iconColors, setIconColors] = useState(defaultIconColors);

  // Hata mesajını göster ve 3 saniye sonra kaldır
  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

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
            const points: Point[] = [];
            
            // Sınır noktalarını çıkar
            for (let i = 0; i < bounds.length; i += 2) {
              points.push({ x: bounds[i], y: bounds[i + 1] });
            }

            // SVG path oluştur
            const path = points.reduce((acc, point, index) => {
              if (index === 0) return `M ${point.x} ${point.y}`;
              return `${acc} L ${point.x} ${point.y}`;
            }, '');

            // Ek sınırları işle
            const additionalPaths: string[] = [];
            if (typedRegion.mapData.additionalBounds) {
              typedRegion.mapData.additionalBounds.forEach(additionalBound => {
                const additionalPoints: Point[] = [];
                for (let i = 0; i < additionalBound.length; i += 2) {
                  additionalPoints.push({ x: additionalBound[i], y: additionalBound[i + 1] });
                }
                const additionalPath = additionalPoints.reduce((acc, point, index) => {
                  if (index === 0) return `M ${point.x} ${point.y}`;
                  return `${acc} L ${point.x} ${point.y}`;
                }, '');
                additionalPaths.push(`${additionalPath} Z`);
              });
            }

            return {
              id: typedRegion.id,
              path: `${path} Z`,
              additionalPaths,
              color: typedRegion.mapData.color || colors[0]
            };
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
  }, [colors]);

  const getLocationIcon = (type: string, color: string = 'rgb(156, 163, 175)') => {
    const style = { color: color };
    
    switch (type) {
      case 'capital': return <FaCrown style={style} className="w-6 h-6" />;
      case 'castle': return <GiCastle style={style} className="w-6 h-6" />;
      case 'city': return <FaCity style={style} className="w-6 h-6" />;
      case 'fortress': return <FaFortAwesome style={style} className="w-6 h-6" />;
      case 'mine': return <GiMiner style={style} className="w-6 h-6" />;
      case 'village': return <GiWoodCabin style={style} className="w-6 h-6" />;
      case 'portal': return <GiPortal style={style} className="w-6 h-6" />;
      case 'sacred_site': return <GiAncientColumns style={style} className="w-6 h-6" />;
      case 'forest': return <FaTree style={style} className="w-8 h-8" />;
      case 'mountain': return <FaMountain style={style} className="w-8 h-8" />;
      default: return null;
    }
  };

  const handleMapClick = useCallback((e: React.MouseEvent) => {
    if (!isEditMode) {
      onRegionClick('');
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    if (editMode === 'draw' || editMode === 'add_bounds') {
      console.log(`Çizim noktası eklendi - Mode: ${editMode}, Point:`, { x, y });
      setDrawingPoints(prev => [...prev, { x, y }]);
    } else if (editMode === 'add' && selectedIconType && iconName) {
      setPendingIcon({ x, y });
    }
  }, [isEditMode, editMode, selectedIconType, iconName, onRegionClick]);

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
      console.log('Kaydetme başladı - Mode:', editMode);
      console.log('Çizim noktaları:', drawingPoints);

      const updateData: {
        regionId: string;
        bounds?: number[];
        additionalBounds?: number[][];
        color?: {
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
        console.log('Ana sınır çizimi kaydediliyor');
        const newColor = colors[selectedColor] || colors[0];
        
        const newPath = getPathFromPoints();
        setRegionPaths(prev => prev.map(rp => 
          rp.id === selectedRegion
            ? { ...rp, path: newPath, color: newColor }
            : rp
        ));

        const flatBounds: number[] = [];
        drawingPoints.forEach(point => {
          flatBounds.push(point.x);
          flatBounds.push(point.y);
        });
        updateData.bounds = flatBounds;
        updateData.color = newColor;
      } else if (editMode === 'add_bounds' && drawingPoints.length >= 3) {
        console.log('Ek sınır çizimi kaydediliyor');
        const flatBounds: number[] = [];
        drawingPoints.forEach(point => {
          flatBounds.push(point.x);
          flatBounds.push(point.y);
        });

        const currentRegion = regionPaths.find(rp => rp.id === selectedRegion);
        console.log('Mevcut bölge:', currentRegion);
        
        if (currentRegion) {
          const newPath = getPathFromPoints();
          console.log('Yeni ek sınır path:', newPath);
          
          setRegionPaths(prev => {
            const updated = prev.map(rp => 
              rp.id === selectedRegion
                ? { 
                    ...rp, 
                    additionalPaths: [...(rp.additionalPaths || []), newPath]
                  }
                : rp
            );
            console.log('Güncellenmiş paths:', updated);
            return updated;
          });

          // Firestore'a gönderilecek veriyi hazırla
          console.log('Hazırlanan flatBounds:', flatBounds);
          updateData.additionalBounds = [flatBounds];
          console.log('API\'ye gönderilecek veri:', updateData);
        }
      }

      console.log('API\'ye gönderilen veri:', updateData);

      const response = await fetch('/api/regions/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      console.log('API yanıtı:', result);

      if (!response.ok) {
        throw new Error('Kaydetme başarısız: ' + (result.error || 'Bilinmeyen hata'));
      }

      console.log('Bölge başarıyla güncellendi');
      
      setIsEditMode(false);
      setEditMode(null);
      setDrawingPoints([]);
      onRegionClick('');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Bölge kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleUndo = () => {
    setDrawingPoints(prev => prev.slice(0, -1));
  };

  const getPathFromPoints = () => {
    if (drawingPoints.length === 0) return '';
    
    const path = drawingPoints.reduce((acc, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');

    console.log('Oluşturulan path:', path + ' Z');
    return path + ' Z';
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
      
      // İkon başarıyla eklendiğinde bölge bilgilerini güncelle
      onLocationsUpdate?.(selectedRegion);
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
        
        // İkon başarıyla silindiğinde bölge bilgilerini güncelle
        onLocationsUpdate?.(selectedRegion);
      } catch (error) {
        console.error('Silme hatası:', error);
      }
    }
  };

  const handleIconClick = (e: React.MouseEvent, icon: Icon) => {
    e.stopPropagation();
    if (editMode === 'delete') {
      handleIconDelete(icon.id);
    } else if (editMode === 'edit_icon') {
      setSelectedIconForEdit(icon);
      setSelectedIconType(icon.type);
      setIconName(icon.name);
      setSelectedIconColor(icon.color);
    }
  };

  const handleUpdateIcon = async () => {
    if (!selectedIconForEdit) return;
    
    // İkonu güncelle
    setIcons(prev => prev.map(icon => 
      icon.id === selectedIconForEdit.id
        ? {
            ...icon,
            type: selectedIconType,
            name: iconName,
            color: selectedIconColor
          }
        : icon
    ));
    
    // Sunucuya güncellemeyi gönder
    if (selectedRegion) {
      try {
        const updatedIcons = icons.map(icon => 
          icon.id === selectedIconForEdit.id
            ? {
                ...icon,
                type: selectedIconType,
                name: iconName,
                color: selectedIconColor
              }
            : icon
        );

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

        if (!response.ok) throw new Error('Güncelleme kaydedilemedi');
        
        // İkon başarıyla güncellendiğinde bölge bilgilerini güncelle
        onLocationsUpdate?.(selectedRegion);
      } catch (error) {
        console.error('Güncelleme hatası:', error);
        alert('İkon güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
    
    setSelectedIconForEdit(null);
    setSelectedIconType('');
    setIconName('');
    setSelectedIconColor('');
  };

  // editMode değiştiğinde form alanlarını temizle
  useEffect(() => {
    setSelectedIconForEdit(null);
    setSelectedIconType('');
    setIconName('');
    setSelectedIconColor('');
    setPendingIcon(null);
  }, [editMode]);

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

  // Controls bileşeninde düzenleme butonuna tıklandığında
  const handleEditClick = () => {
    if (!selectedRegion) {
      showError('Lütfen önce haritadan bir bölge seçin');
      return;
    }
    if (!isEditMode) {
      onLocationsUpdate?.(selectedRegion);
    }
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="relative w-full h-[800px] bg-[#0B1120] rounded-lg overflow-hidden">
      {/* Hata mesajı */}
      {errorMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg font-risque">
            {errorMessage}
          </div>
        </div>
      )}

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
                onEditClick={handleEditClick}
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
                colors={colors}
                setColors={setColors}
                iconColors={iconColors}
                setIconColors={setIconColors}
                selectedRegion={selectedRegion}
                setRegionPaths={setRegionPaths}
                selectedIconForEdit={selectedIconForEdit}
                handleUpdateIcon={handleUpdateIcon}
                setIsEditMode={setIsEditMode}
                setDrawingPoints={setDrawingPoints}
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
                      if (isEditMode && region.id !== selectedRegion) return null;
                      
                      const isSelected = region.id === selectedRegion;
                      
                      return (
                        <React.Fragment key={region.id}>
                          {/* Ana sınır */}
                          <path
                            d={region.path}
                            fill={region.color.fill}
                            stroke={region.color.stroke}
                            strokeWidth={isSelected ? "0.6" : "0.4"}
                            className={`transition-all duration-200 ${
                              !isEditMode ? 'cursor-pointer hover:stroke-amber-500' : ''
                            } ${isSelected ? 'stroke-amber-500' : ''}`}
                            onClick={(e) => !isEditMode && handleRegionClick(e, region.id)}
                            style={{ 
                              pointerEvents: !isEditMode ? 'all' : 'none',
                              filter: isSelected ? 'drop-shadow(0 0 2px rgba(245, 158, 11, 0.5))' : 'none'
                            }}
                          />
                          {/* Ek sınırlar */}
                          {region.additionalPaths?.map((additionalPath, index) => (
                            <path
                              key={`${region.id}-additional-${index}`}
                              d={additionalPath}
                              fill={region.color.fill}
                              stroke={region.color.stroke}
                              strokeWidth={isSelected ? "0.6" : "0.4"}
                              className={`transition-all duration-200`}
                              style={{ 
                                filter: isSelected ? 'drop-shadow(0 0 2px rgba(245, 158, 11, 0.5))' : 'none'
                              }}
                            />
                          ))}
                        </React.Fragment>
                      );
                    })}

                    {/* Çizim modu aktif sınır */}
                    {isEditMode && (editMode === 'draw' || editMode === 'add_bounds') && drawingPoints.length > 0 && (
                      <path
                        d={getPathFromPoints()}
                        fill={colors[selectedColor]?.fill || colors[0].fill}
                        stroke={colors[selectedColor]?.stroke || colors[0].stroke}
                        strokeWidth="0.4"
                      />
                    )}

                    {/* Çizim noktaları */}
                    {isEditMode && (editMode === 'draw' || editMode === 'add_bounds') && drawingPoints.map((point, index) => (
                      <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="0.3"
                        fill={colors[selectedColor]?.stroke || colors[0].stroke}
                      />
                    ))}
                  </svg>

                  {/* İkonlar */}
                  {icons.map(icon => {
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
                          <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-white font-risque ${
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
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-white font-risque">
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
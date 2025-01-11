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

interface AdditionalBound {
  id: string;
  bounds: number[];
}

interface RegionPath {
  id: string;
  path: string;
  additionalPaths?: {
    id: string;
    path: string;
  }[];
  color: {
    fill: string;
    stroke: string;
  };
}

interface Region {
  id: string;
  name: string;
  type: string;
  mapData: {
    bounds: number[];
    additionalBounds?: AdditionalBound[];
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

export default function MapWrapper({ onRegionClick, selectedRegion, onLocationsUpdate }: MapWrapperProps) {
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
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconColorPicker, setShowIconColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState<{ fill: string; stroke: string } | null>(null);
  const [tempIconColor, setTempIconColor] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState(defaultColors[0].stroke);
  const [customIconColor, setCustomIconColor] = useState(defaultIconColors[0]);

  // Hex'ten RGB'ye dönüşüm fonksiyonu
  const hexToRgb = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }, []);

  // Hata mesajını göster ve 3 saniye sonra kaldır
  const showError = useCallback((message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  }, []);

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
            const additionalPaths: { id: string; path: string; }[] = [];
            
            if (typedRegion.mapData.additionalBounds && Array.isArray(typedRegion.mapData.additionalBounds)) {
              typedRegion.mapData.additionalBounds.forEach(bound => {
                if (bound && bound.bounds && Array.isArray(bound.bounds)) {
                  const additionalPoints: Point[] = [];
                  for (let i = 0; i < bound.bounds.length; i += 2) {
                    additionalPoints.push({ x: bound.bounds[i], y: bound.bounds[i + 1] });
                  }
                  
                  const additionalPath = additionalPoints.reduce((acc, point, index) => {
                    if (index === 0) return `M ${point.x} ${point.y}`;
                    return `${acc} L ${point.x} ${point.y}`;
                  }, '');
                  
                  additionalPaths.push({
                    id: bound.id,
                    path: `${additionalPath} Z`
                  });
                }
              });
            }

            return {
              id: typedRegion.id,
              path: `${path} Z`,
              additionalPaths,
              color: typedRegion.mapData.color || colors[0]
            };
          });

        setRegionPaths(paths);

        // İkonları yükle
        const allIcons: Icon[] = [];
        (Object.values(data.regions) as Region[]).forEach((region) => {
          if (region.locations && Array.isArray(region.locations)) {
            region.locations.forEach((location) => {
              if (location.coordinates && Array.isArray(location.coordinates)) {
                allIcons.push({
                  id: `${region.id}-${location.name.toLowerCase().replace(/\s+/g, '-')}`,
                  type: location.type,
                  position: {
                    x: location.coordinates[0],
                    y: location.coordinates[1]
                  },
                  name: location.name,
                  regionId: region.id,
                  color: location.color || 'rgb(156, 163, 175)'
                });
              }
            });
          }
        });

        setIcons(allIcons);
        setIsLoading(false);
      } catch (error) {
        console.error('Bölgeler yüklenirken hata:', error);
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

  const handleIconMouseDown = useCallback((e: React.MouseEvent, icon: Icon) => {
    e.stopPropagation();
    if (isEditMode && editMode === 'move') {
      setSelectedIcon(icon);
      setIsDragging(true);
    }
  }, [isEditMode, editMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedIcon) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Add smooth transition and bounds checking
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));

    setIcons(prev => prev.map(icon => 
      icon.id === selectedIcon.id
        ? { ...icon, position: { x: boundedX, y: boundedY } }
        : icon
    ));
  }, [isDragging, selectedIcon]);

  const handleMouseUp = useCallback(async () => {
    if (!isDragging || !selectedIcon) return;

    setIsDragging(false);
    const updatedIcon = icons.find(icon => icon.id === selectedIcon.id);

    if (updatedIcon) {
      try {
        const response = await fetch('/api/regions/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            regionId: updatedIcon.regionId,
            icons: icons
              .filter(icon => icon.regionId === updatedIcon.regionId)
              .map(icon => ({
                name: icon.name,
                type: icon.type,
                coordinates: [icon.position.x, icon.position.y],
                color: icon.color
              }))
          }),
        });

        if (!response.ok) throw new Error('İkon güncelleme başarısız');
        
        onLocationsUpdate?.(updatedIcon.regionId);
      } catch (error) {
        console.error('İkon güncelleme hatası:', error);
        setIcons(prev => prev.map(icon => 
          icon.id === selectedIcon.id
            ? selectedIcon
            : icon
        ));
      }
    }

    setSelectedIcon(null);
  }, [isDragging, selectedIcon, icons, onLocationsUpdate]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && selectedIcon) {
        const rect = document.querySelector('.map-container')?.getBoundingClientRect();
        if (rect) {
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;

          // Add bounds checking for global mouse move
          const boundedX = Math.max(0, Math.min(100, x));
          const boundedY = Math.max(0, Math.min(100, y));

          setIcons(prev => prev.map(icon => 
            icon.id === selectedIcon.id
              ? { ...icon, position: { x: boundedX, y: boundedY } }
              : icon
          ));
        }
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, selectedIcon, handleMouseUp]);

  const handleSave = async () => {
    if (!selectedRegion) return;

    try {
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
        const flatBounds: number[] = [];
        drawingPoints.forEach(point => {
          flatBounds.push(point.x);
          flatBounds.push(point.y);
        });

        const currentRegion = regionPaths.find(rp => rp.id === selectedRegion);
        
        if (currentRegion) {
          const newPath = getPathFromPoints();
          const newBoundId = `${selectedRegion}-bound-${Date.now()}`;
          
          setRegionPaths(prev => prev.map(rp => 
            rp.id === selectedRegion
              ? { 
                  ...rp, 
                  additionalPaths: [
                    ...(rp.additionalPaths || []),
                    { 
                      id: newBoundId, 
                      path: newPath,
                    }
                  ]
                }
              : rp
          ));

          updateData.additionalBounds = [flatBounds];
        }
      } else if (editMode === 'color' && selectedRegion) {
        const newColor = colors[selectedColor] || colors[0];
        updateData.color = newColor;
        
        setRegionPaths(prev => prev.map(rp => 
          rp.id === selectedRegion
            ? { ...rp, color: newColor }
            : rp
        ));
      }

      const response = await fetch('/api/regions/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Kaydetme başarısız');
      }
      
      setIsEditMode(false);
      setEditMode(null);
      setDrawingPoints([]);
      onRegionClick('');
      
      // Renk değişikliğini kalıcı yapmak için bölge bilgilerini güncelle
      onLocationsUpdate?.(selectedRegion);
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

  const handleIconDelete = useCallback(async (iconId: string) => {
    const iconToDelete = icons.find(icon => icon.id === iconId);
    if (!iconToDelete) return;

    const updatedIcons = icons.filter(icon => icon.id !== iconId);
    setIcons(updatedIcons);

    try {
      const response = await fetch('/api/regions/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          regionId: iconToDelete.regionId,
          icons: updatedIcons
            .filter(icon => icon.regionId === iconToDelete.regionId)
            .map(icon => ({
              name: icon.name,
              type: icon.type,
              coordinates: [icon.position.x, icon.position.y],
              color: icon.color
            }))
        }),
      });

      if (!response.ok) {
        throw new Error('İkon silinemedi');
      }

      onLocationsUpdate?.(iconToDelete.regionId);
    } catch (error) {
      console.error('İkon silme hatası:', error);
      // Hata durumunda ikonu geri ekle
      setIcons(prev => [...prev, iconToDelete]);
    }
  }, [icons, onLocationsUpdate]);

  // editMode değiştiğinde form alanlarını temizle
  useEffect(() => {
    setSelectedIconForEdit(null);
    setSelectedIconType('');
    setIconName('');
    setSelectedIconColor('');
    setPendingIcon(null);
  }, [editMode]);

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

  const handleSaveClick = async () => {
    await handleSave();
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
          maxScale={2}
          wheel={{ disabled: true }}
          doubleClick={{ disabled: true }}
        >
          {() => (
            <>
              <div className="absolute top-4 left-4 z-[1000] space-y-2">
                {!isEditMode ? (
                  <button
                    onClick={handleEditClick}
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors font-risque"
                  >
                    Düzenle
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveClick}
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
                      <button
                        onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
                        className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        {isMenuCollapsed ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </button>
                      {drawingPoints.length > 0 && (
                        <button
                          onClick={handleUndo}
                          className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {!isMenuCollapsed && (
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
                            onClick={() => setEditMode(editMode === 'add' || editMode === 'edit_icon' || editMode === 'delete' || editMode === 'move' ? null : 'add')}
                            className={`flex-1 px-4 py-2 rounded-lg transition-colors font-risque ${
                              (editMode === 'add' || editMode === 'edit_icon' || editMode === 'delete' || editMode === 'move') ? 'bg-amber-500 text-white' : 'bg-[#1C2B4B] text-gray-400 hover:text-amber-500'
                            }`}
                          >
                            İkon
                          </button>
                        </div>

                        {/* Alt menüler */}
                        {/* Mevcut alt menü içeriği */}
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
                                    >
                                      <span className="text-gray-400 text-xl">+</span>
                                    </button>
                                    {showColorPicker && (
                                      <div className="absolute top-full left-0 mt-1 z-50">
                                        <input
                                          type="color"
                                          value={customColor}
                                          onChange={(e) => {
                                            const newColor = e.target.value;
                                            const rgb = hexToRgb(newColor);
                                            const newColorObj = {
                                              fill: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
                                              stroke: newColor
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

                        {(editMode === 'add' || editMode === 'edit_icon' || editMode === 'delete' || editMode === 'move') && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-4 gap-1">
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
                                onClick={() => setEditMode('move')}
                                className={`px-4 py-2 rounded-lg transition-colors font-risque ${
                                  editMode === 'move' ? 'bg-amber-500 text-white' : 'bg-[#1C2B4B] text-gray-400 hover:text-amber-500'
                                }`}
                              >
                                Taşı
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
                                      >
                                        <span className="text-gray-400 text-xl">+</span>
                                      </button>
                                      {showIconColorPicker && (
                                        <div className="absolute top-full left-0 mt-1 z-50">
                                          <input
                                            type="color"
                                            value={customIconColor}
                                            onChange={(e) => {
                                              const newColor = e.target.value;
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
                                  onClick={editMode === 'add' ? handleAddIcon : handleUpdateIcon}
                                  disabled={!selectedIconType || !iconName || !selectedIconColor}
                                  className="w-full bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors font-risque disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {editMode === 'add' ? 'Ekle' : 'Güncelle'}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <TransformComponent
                wrapperClass="!w-full !h-full"
                contentClass="!w-full !h-full"
              >
                <div 
                  className="relative w-full h-full map-container"
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
                      const isHovered = hoveredRegionId === region.id;
                      
                      return (
                        <React.Fragment key={region.id}>
                          {/* Ana sınır */}
                          <path
                            d={region.path}
                            fill={region.color.fill}
                            stroke={region.color.stroke}
                            strokeWidth={isSelected ? "0.6" : "0.4"}
                            className={`transition-all duration-200 ${
                              !isEditMode ? 'cursor-pointer' : ''
                            } ${isSelected || isHovered ? 'stroke-amber-500' : ''}`}
                            onClick={(e) => !isEditMode && handleRegionClick(e, region.id)}
                            onMouseEnter={() => !isEditMode && setHoveredRegionId(region.id)}
                            onMouseLeave={() => !isEditMode && setHoveredRegionId(null)}
                            style={{ 
                              pointerEvents: !isEditMode ? 'all' : 'none'
                            }}
                          />
                          {/* Ek sınırlar */}
                          {region.additionalPaths?.map((additionalPath) => (
                            <path
                              key={additionalPath.id}
                              d={additionalPath.path}
                              fill={region.color.fill}
                              stroke={region.color.stroke}
                              strokeWidth={isSelected ? "0.6" : "0.4"}
                              className={`transition-all duration-200 ${
                                !isEditMode ? 'cursor-pointer' : ''
                              } ${isSelected || isHovered ? 'stroke-amber-500' : ''}`}
                              onClick={(e) => !isEditMode && handleRegionClick(e, region.id)}
                              onMouseEnter={() => !isEditMode && setHoveredRegionId(region.id)}
                              onMouseLeave={() => !isEditMode && setHoveredRegionId(null)}
                              style={{ 
                                pointerEvents: !isEditMode ? 'all' : 'none'
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
                    const IconComponent = getLocationIcon(icon.type, icon.color);
                    const isCapital = icon.type === 'capital';
                    return IconComponent && (
                      <div
                        key={icon.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-${isEditMode && editMode === 'move' ? 'move' : 'pointer'} transition-transform duration-150 hover:scale-110 ${
                          isDragging && selectedIcon?.id === icon.id ? 'scale-125' : ''
                        } group`}
                        style={{
                          left: `${icon.position.x}%`,
                          top: `${icon.position.y}%`,
                          zIndex: isDragging && selectedIcon?.id === icon.id ? 1000 : 1
                        }}
                        onMouseDown={(e) => handleIconMouseDown(e, icon)}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isEditMode && editMode === 'delete') {
                            handleIconDelete(icon.id);
                          } else if (!isEditMode) {
                            setSelectedIconForEdit(icon);
                          }
                        }}
                        onMouseEnter={() => setHoveredIcon(icon.id)}
                        onMouseLeave={() => setHoveredIcon(null)}
                      >
                        {IconComponent}
                        <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-white font-risque ${
                          isCapital ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        } transition-opacity duration-200`}>
                          {icon.name}
                        </div>
                        {(isEditMode && editMode === 'delete' && hoveredIcon === icon.id) && (
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">×</span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Bekleyen İkon */}
                  {editMode === 'add' && pendingIcon && selectedIconType && (
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
                        <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-white font-risque ${
                          selectedIconType === 'capital' ? 'opacity-100' : ''
                        }`}>
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
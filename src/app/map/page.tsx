'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import MapWrapper from '@/components/map/MapWrapper';
import { FaSearch, FaFilter, FaSkull, FaGem, FaUsers, FaThermometerHalf, FaMapMarkerAlt, FaTimesCircle, FaHorse, FaShip, FaCrown, FaCity, FaFortAwesome } from 'react-icons/fa';
import { GiCastle, GiMiner, GiWoodCabin, GiPortal, GiAncientColumns } from 'react-icons/gi';

interface TravelTime {
  from: string;
  to: string;
  byHorse: string;
  byShip?: string;
}

interface RegionData {
  id: string;
  name: string;
  description: string;
  image: string;
  type: string;
  climate: string;
  dominantRace: string;
  dangerLevel: number;
  features: string[];
  locations: {
    name: string;
    type: string;
    description: string;
    population?: string;
    coordinates: [number, number];
    color?: string;
  }[];
  mapData: {
    bounds: [number, number][];
    center: [number, number];
    color?: {
      fill: string;
      stroke: string;
    };
  };
  resources: {
    name: string;
    type: string;
    rarity: string;
    description: string;
  }[];
  threats: {
    name: string;
    type: string;
    dangerLevel: number;
    description: string;
  }[];
  travelTimes: TravelTime[];
  temperature?: {
    summer: string;
    winter: string;
  };
}

interface RegionsData {
  regions: Record<string, RegionData>;
}

export default function MapPage() {
  const [regionsData, setRegionsData] = useState<RegionsData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    climate: '',
    race: '',
    dangerLevel: '',
    resourceType: ''
  });
  const [activeTab, setActiveTab] = useState<'info' | 'resources' | 'threats' | 'locations' | 'travel'>('info');

  useEffect(() => {
    fetch('/api/regions')
      .then(res => res.json())
      .then(data => setRegionsData(data));
  }, []);

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId);
    if (regionId) {
      setShowDetails(true);
      setActiveTab('info');
    } else {
      setShowDetails(false);
    }
  };

  const handleLocationsUpdate = (regionId: string) => {
    if (regionId === selectedRegion) {
      setShowDetails(false);
      fetch('/api/regions')
        .then(res => res.json())
        .then(data => {
          setRegionsData(data);
        });
    }
  };

  const filterRegions = () => {
    if (!regionsData?.regions) return [];
    
    return Object.entries(regionsData.regions).filter(([, region]) => {
      if (!region) return false;

      const matchesSearch = !searchTerm || 
        (region.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.locations?.some(loc => loc.name?.toLowerCase().includes(searchTerm.toLowerCase()))) || false;

      const matchesType = !filters.type || region.type === filters.type;
      const matchesClimate = !filters.climate || region.climate === filters.climate;
      const matchesRace = !filters.race || region.dominantRace === filters.race;
      const matchesDanger = !filters.dangerLevel || region.dangerLevel?.toString() === filters.dangerLevel;
      const matchesResource = !filters.resourceType || 
        region.resources?.some(res => res.type === filters.resourceType) || false;

      return matchesSearch && matchesType && matchesClimate && matchesRace && 
             matchesDanger && matchesResource;
    });
  };

  const filteredRegions = filterRegions();

  const getDangerLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'text-green-400';
      case 2: return 'text-yellow-400';
      case 3: return 'text-orange-400';
      case 4: return 'text-red-400';
      case 5: return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'very_rare': return 'text-purple-400';
      case 'legendary': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <main className="min-h-screen bg-[#0B1120]">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center bg-gradient-to-b from-[#0B1120] via-[#162137] to-[#1C2B4B]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/90 via-[#162137]/80 to-[#1C2B4B]/90 z-10" />
          <Image
            src="/map-bg.jpg"
            alt={`Kael'Theron Haritası`}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        </div>
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl font-hennyPenny text-white mb-6 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]">
              {`Kael'Theron Haritası`}
            </h1>
            <p className="text-2xl font-risque text-gray-200 mb-8">
              Efsanevi toprakları keşfedin
            </p>
            <div className="flex items-center justify-center gap-2 text-amber-400/80 font-risque">
              <span className="w-12 h-[1px] bg-amber-400/40" />
              <span>Bölgeler ve Yerleşimler</span>
              <span className="w-12 h-[1px] bg-amber-400/40" />
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B1120] to-transparent" />
      </section>

      {/* Map Container */}
      <div className="relative max-w-[1600px] mx-auto">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          {/* Arama ve Filtre Bölümü */}
          <div className="mb-8 bg-[#162137] rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Bölge, yerleşim veya özellik ara..."
                  className="w-full bg-[#1C2B4B] rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <FaTimesCircle />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-amber-500 text-white' : 'bg-[#1C2B4B] text-gray-400 hover:text-amber-500'
                }`}
              >
                <FaFilter className="w-5 h-5" />
              </button>
            </div>

            {/* Filtreler */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                      className="bg-[#1C2B4B] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Bölge Tipi</option>
                      <option value="forest">Orman</option>
                      <option value="mountain">Dağlık</option>
                      <option value="plains">Ova</option>
                      <option value="desert">Çöl</option>
                    </select>
                    <select
                      value={filters.climate}
                      onChange={(e) => setFilters(prev => ({ ...prev, climate: e.target.value }))}
                      className="bg-[#1C2B4B] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">İklim</option>
                      <option value="cold">Soğuk</option>
                      <option value="temperate">Ilıman</option>
                      <option value="hot">Sıcak</option>
                    </select>
                    <select
                      value={filters.race}
                      onChange={(e) => setFilters(prev => ({ ...prev, race: e.target.value }))}
                      className="bg-[#1C2B4B] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Hakim Irk</option>
                      <option value="human">İnsan</option>
                      <option value="elf">Elf</option>
                      <option value="dwarf">Cüce</option>
                    </select>
                    <select
                      value={filters.dangerLevel}
                      onChange={(e) => setFilters(prev => ({ ...prev, dangerLevel: e.target.value }))}
                      className="bg-[#1C2B4B] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Tehlike Seviyesi</option>
                      <option value="1">1 - Güvenli</option>
                      <option value="2">2 - Düşük</option>
                      <option value="3">3 - Orta</option>
                      <option value="4">4 - Yüksek</option>
                      <option value="5">5 - Çok Tehlikeli</option>
                    </select>
                    <select
                      value={filters.resourceType}
                      onChange={(e) => setFilters(prev => ({ ...prev, resourceType: e.target.value }))}
                      className="bg-[#1C2B4B] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Kaynak Tipi</option>
                      <option value="metal">Metal</option>
                      <option value="mineral">Mineral</option>
                      <option value="magical">Büyülü</option>
                      <option value="herb">Bitki</option>
                    </select>
                  </div>
                  
                  {/* Aktif Filtreler */}
                  {Object.values(filters).some(Boolean) && (
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-sm text-gray-400">Aktif Filtreler:</span>
                      <button
                        onClick={() => setFilters({
                          type: '',
                          climate: '',
                          race: '',
                          dangerLevel: '',
                          resourceType: ''
                        })}
                        className="text-sm text-amber-500 hover:text-amber-400"
                      >
                        Temizle
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filtrelenmiş Sonuçlar */}
            {(searchTerm || Object.values(filters).some(Boolean)) && (
              <div className="mt-4 p-4 bg-[#1C2B4B] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">
                    {filteredRegions.length} bölge bulundu
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRegions.map(([id, region]) => (
                    <button
                      key={id}
                      onClick={() => handleRegionClick(id)}
                      className="flex items-center gap-3 p-3 bg-[#162137] rounded-lg hover:bg-[#1C2B4B] transition-colors text-left"
                    >
                      <FaMapMarkerAlt className={getDangerLevelColor(region.dangerLevel)} />
                      <div>
                        <h4 className="text-white font-risque">{region.name}</h4>
                        <p className="text-sm text-gray-400 line-clamp-1">{region.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map Section */}
          <section className="relative z-10">
            <MapWrapper 
              onRegionClickAction={handleRegionClick} 
              selectedRegion={selectedRegion}
              onLocationsUpdate={handleLocationsUpdate}
            />
            
            {/* Region Details Modal */}
            <AnimatePresence>
              {showDetails && selectedRegion && regionsData?.regions[selectedRegion] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center px-4"
                >
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetails(false)} />
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="relative bg-[#162137] rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
                  >
                    {/* Modal Header */}
                    <div className="relative h-48">
                      <Image
                        src={regionsData.regions[selectedRegion].image}
                        alt={regionsData.regions[selectedRegion].name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#162137] to-transparent" />
                      <button
                        onClick={() => setShowDetails(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Region Title and Quick Stats */}
                    <div className="p-6 pb-4 -mt-16 relative">
                      <h3 className="text-3xl font-hennyPenny text-yellow-300 mb-2">
                        {regionsData.regions[selectedRegion].name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">
                          <FaUsers className="inline mr-1" />
                          {regionsData.regions[selectedRegion].dominantRace === 'human' && 'İnsan'}
                          {regionsData.regions[selectedRegion].dominantRace === 'elf' && 'Elf'}
                          {regionsData.regions[selectedRegion].dominantRace === 'dwarf' && 'Cüce'}
                        </span>
                        <span className="text-gray-400">
                          <FaThermometerHalf className="inline mr-1" />
                          {regionsData.regions[selectedRegion].climate === 'cold' && 'Soğuk'}
                          {regionsData.regions[selectedRegion].climate === 'temperate' && 'Ilıman'}
                          {regionsData.regions[selectedRegion].climate === 'hot' && 'Sıcak'}
                        </span>
                        <span className={getDangerLevelColor(regionsData.regions[selectedRegion].dangerLevel)}>
                          <FaSkull className="inline mr-1" />
                          Tehlike Seviyesi: {regionsData.regions[selectedRegion].dangerLevel}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="px-6 border-b border-[#1C2B4B]">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setActiveTab('info')}
                          className={`py-2 px-4 font-risque transition-colors ${
                            activeTab === 'info'
                              ? 'text-amber-400 border-b-2 border-amber-400'
                              : 'text-gray-400 hover:text-gray-300'
                          }`}
                        >
                          Genel Bilgi
                        </button>
                        <button
                          onClick={() => setActiveTab('locations')}
                          className={`py-2 px-4 font-risque transition-colors ${
                            activeTab === 'locations'
                              ? 'text-amber-400 border-b-2 border-amber-400'
                              : 'text-gray-400 hover:text-gray-300'
                          }`}
                        >
                          Yerleşimler
                        </button>
                        <button
                          onClick={() => setActiveTab('resources')}
                          className={`py-2 px-4 font-risque transition-colors ${
                            activeTab === 'resources'
                              ? 'text-amber-400 border-b-2 border-amber-400'
                              : 'text-gray-400 hover:text-gray-300'
                          }`}
                        >
                          Kaynaklar
                        </button>
                        <button
                          onClick={() => setActiveTab('threats')}
                          className={`py-2 px-4 font-risque transition-colors ${
                            activeTab === 'threats'
                              ? 'text-amber-400 border-b-2 border-amber-400'
                              : 'text-gray-400 hover:text-gray-300'
                          }`}
                        >
                          Tehditler
                        </button>
                        <button
                          onClick={() => setActiveTab('travel')}
                          className={`py-2 px-4 font-risque transition-colors ${
                            activeTab === 'travel'
                              ? 'text-amber-400 border-b-2 border-amber-400'
                              : 'text-gray-400 hover:text-gray-300'
                          }`}
                        >
                          Seyahat
                        </button>
                      </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 overflow-y-auto max-h-[400px]">
                      {activeTab === 'info' && (
                        <div className="space-y-6">
                          <p className="text-gray-200 font-risque">
                            {regionsData.regions[selectedRegion].description}
                          </p>
                          <div>
                            <h4 className="text-xl font-risque text-amber-300 mb-3">Özellikler</h4>
                            <ul className="grid grid-cols-2 gap-2">
                              {regionsData.regions[selectedRegion].features.map((feature, index) => (
                                <li key={index} className="text-gray-300 font-risque flex items-center">
                                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {activeTab === 'locations' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {regionsData.regions[selectedRegion].locations.map((location, index) => (
                            <div key={index} className="bg-[#1C2B4B] rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-lg font-risque text-yellow-200">{location.name}</h5>
                                <span className="text-amber-400/80">
                                  {location.type === 'capital' && <FaCrown className="w-5 h-5" />}
                                  {location.type === 'castle' && <GiCastle className="w-5 h-5" />}
                                  {location.type === 'city' && <FaCity className="w-5 h-5" />}
                                  {location.type === 'fortress' && <FaFortAwesome className="w-5 h-5" />}
                                  {location.type === 'mine' && <GiMiner className="w-5 h-5" />}
                                  {location.type === 'village' && <GiWoodCabin className="w-5 h-5" />}
                                  {location.type === 'portal' && <GiPortal className="w-5 h-5" />}
                                  {location.type === 'sacred_site' && <GiAncientColumns className="w-5 h-5" />}
                                </span>
                              </div>
                              <p className="text-gray-300 font-risque text-sm mb-2">{location.description}</p>
                              {location.population && (
                                <p className="text-sm text-gray-400">
                                  <FaUsers className="inline mr-1" />
                                  Nüfus: {location.population}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'resources' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {regionsData.regions[selectedRegion].resources.map((resource, index) => (
                            <div key={index} className="bg-[#1C2B4B] rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-lg font-risque text-yellow-200">{resource.name}</h5>
                                <span className={`text-sm font-risque ${getRarityColor(resource.rarity)}`}>
                                  <FaGem className="inline mr-1" />
                                  {resource.rarity === 'common' && 'Yaygın'}
                                  {resource.rarity === 'uncommon' && 'Sıradan'}
                                  {resource.rarity === 'rare' && 'Nadir'}
                                  {resource.rarity === 'very_rare' && 'Çok Nadir'}
                                  {resource.rarity === 'legendary' && 'Efsanevi'}
                                </span>
                              </div>
                              <p className="text-gray-300 font-risque text-sm">{resource.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'threats' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {regionsData.regions[selectedRegion].threats.map((threat, index) => (
                            <div key={index} className="bg-[#1C2B4B] rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-lg font-risque text-yellow-200">{threat.name}</h5>
                                <span className={`text-sm font-risque ${getDangerLevelColor(threat.dangerLevel)}`}>
                                  <FaSkull className="inline mr-1" />
                                  Seviye {threat.dangerLevel}
                                </span>
                              </div>
                              <p className="text-gray-300 font-risque text-sm">{threat.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'travel' && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-gray-400"><FaHorse className="inline mr-1" /> At ile</span>
                            <span className="text-gray-400 ml-4"><FaShip className="inline mr-1" /> Gemi ile</span>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            {regionsData.regions[selectedRegion].travelTimes?.map((travel, index) => (
                              <div key={index} className="bg-[#1C2B4B] rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-amber-400" />
                                    <h5 className="text-lg font-risque text-yellow-200">
                                      {travel.to}
                                    </h5>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-300">
                                      <FaHorse className="inline mr-1" />
                                      {travel.byHorse}
                                    </span>
                                    {travel.byShip && (
                                      <span className="text-sm text-gray-300">
                                        <FaShip className="inline mr-1" />
                                        {travel.byShip}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </main>
  );
} 
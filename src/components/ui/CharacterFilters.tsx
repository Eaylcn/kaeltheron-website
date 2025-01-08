'use client';

import React from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';

interface CharacterFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedRace: string;
  setSelectedRace: (race: string) => void;
  selectedFaction: string;
  setSelectedFaction: (faction: string) => void;
}

export default function CharacterFilters({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  selectedRace,
  setSelectedRace,
  selectedFaction,
  setSelectedFaction,
}: CharacterFiltersProps) {
  // İçerik tipine göre filtreleri sıfırla
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedCategory('');
    setSelectedRace('');
    setSelectedFaction('');
  };

  return (
    <div className="bg-[#1C2B4B] backdrop-blur-sm rounded-xl p-6">
      {/* Üst Filtreler */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${selectedType ? 'mb-6' : ''}`}>
        {/* Arama */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Karakter veya Fraksiyon Ara..."
            className="w-full bg-[#162137] rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* İçerik Tipi */}
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full bg-[#162137] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none pr-10"
          >
            <option value="">Tüm İçerik</option>
            <option value="character">Karakterler</option>
            <option value="faction">Fraksiyonlar</option>
          </select>
          <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Alt Filtreler - Sadece spesifik bir tip seçiliyse göster */}
      {selectedType && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Statü/Tip Filtresi */}
          <div>
            <label className="block text-sm font-risque text-gray-400 mb-2">
              {selectedType === 'faction' ? 'Fraksiyon Tipi' : 'Statü'}
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#162137] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none pr-10"
              >
                {selectedType === 'faction' ? (
                  <>
                    <option value="">Tüm Tipler</option>
                    <option value="kingdom">Krallık</option>
                    <option value="council">Konsey</option>
                    <option value="cult">Tarikat</option>
                    <option value="guild">Lonca</option>
                    <option value="order">Düzen</option>
                  </>
                ) : (
                  <>
                    <option value="">Tüm Statüler</option>
                    <option value="leader">Lider</option>
                    <option value="legend">Efsanevi Varlık</option>
                    <option value="faction-member">Fraksiyon Üyesi</option>
                    <option value="creature">Yaratık</option>
                    <option value="guardian">Koruyucu</option>
                    <option value="champion">Şampiyon</option>
                  </>
                )}
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Irk/Etki Alanı Filtresi */}
          <div>
            <label className="block text-sm font-risque text-gray-400 mb-2">
              {selectedType === 'faction' ? 'Etki Alanı' : 'Irk'}
            </label>
            <div className="relative">
              <select
                value={selectedRace}
                onChange={(e) => setSelectedRace(e.target.value)}
                className="w-full bg-[#162137] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none pr-10"
              >
                {selectedType === 'faction' ? (
                  <>
                    <option value="">Tüm Bölgeler</option>
                    <optgroup label="Ana Bölgeler">
                      <option value="merkez">Merkez Topraklar</option>
                      <option value="kuzey">Kuzey Toprakları</option>
                      <option value="guney">Güney Toprakları</option>
                    </optgroup>
                    <optgroup label="Özel Bölgeler">
                      <option value="eryndor">Eryndor Ormanları</option>
                      <option value="anvilheim">Anvilheim Dağları</option>
                      <option value="auroras">Auroras Buz Çölü</option>
                    </optgroup>
                  </>
                ) : (
                  <>
                    <option value="">Tüm Irklar</option>
                    <optgroup label="Medeni Irklar">
                      <option value="human">İnsan</option>
                      <option value="elf">Elf</option>
                      <option value="dwarf">Cüce</option>
                    </optgroup>
                    <optgroup label="Efsanevi Varlıklar">
                      <option value="dragon">Ejderha</option>
                      <option value="elemental">Elemental</option>
                      <option value="celestial">Göksel</option>
                      <option value="fiend">İblis</option>
                    </optgroup>
                    <optgroup label="Yaratıklar">
                      <option value="beast">Canavar</option>
                      <option value="monstrosity">Ucube</option>
                      <option value="undead">Hortlak</option>
                    </optgroup>
                  </>
                )}
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Bağlılık/Uzmanlık Filtresi */}
          <div>
            <label className="block text-sm font-risque text-gray-400 mb-2">
              {selectedType === 'faction' ? 'Uzmanlık' : 'Bağlılık'}
            </label>
            <div className="relative">
              <select
                value={selectedFaction}
                onChange={(e) => setSelectedFaction(e.target.value)}
                className="w-full bg-[#162137] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none pr-10"
              >
                {selectedType === 'faction' ? (
                  <>
                    <option value="">Tüm Uzmanlıklar</option>
                    <option value="magic">Büyü Sanatları</option>
                    <option value="military">Askeri Güç</option>
                    <option value="trade">Ticaret</option>
                    <option value="diplomacy">Diplomasi</option>
                    <option value="knowledge">Bilgi ve Araştırma</option>
                    <option value="espionage">Gizli Operasyonlar</option>
                  </>
                ) : (
                  <>
                    <option value="">Tüm Bağlılıklar</option>
                    <optgroup label="Krallıklar">
                      <option value="velisara-kingdom">Velisara Krallığı</option>
                      <option value="anvilheim">Anvilheim Krallığı</option>
                    </optgroup>
                    <optgroup label="Büyü Toplulukları">
                      <option value="eryndor-council">Eryndor Konseyi</option>
                      <option value="karabuyu-tarikati">Karabüyü Tarikatı</option>
                    </optgroup>
                    <optgroup label="Kozmik Güçler">
                      <option value="order">Düzen Güçleri</option>
                      <option value="chaos">Kaos Güçleri</option>
                    </optgroup>
                    <optgroup label="Diğer">
                      <option value="independent">Bağımsız</option>
                      <option value="wild">Vahşi</option>
                    </optgroup>
                  </>
                )}
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
'use client';

import React from 'react';
import { FaSearch } from 'react-icons/fa';

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
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Karakter veya Fraksiyon Ara..."
            className="w-full bg-[#1C2B4B] rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-[#1C2B4B] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">Tüm İçerik</option>
          <option value="character">Karakterler</option>
          <option value="faction">Fraksiyonlar</option>
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#1C2B4B] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">Tüm Rütbeler</option>
          <option value="leader">Lider</option>
          <option value="legend">Efsane</option>
          <option value="faction-member">Fraksiyon Üyesi</option>
          <option value="creature">Yaratık</option>
        </select>

        {/* Race Filter */}
        <select
          value={selectedRace}
          onChange={(e) => setSelectedRace(e.target.value)}
          className="bg-[#1C2B4B] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">Tüm Irklar</option>
          <option value="human">İnsan</option>
          <option value="elf">Elf</option>
          <option value="dwarf">Cüce</option>
          <option value="dragon">Ejderha</option>
          <option value="beast">Yaratık</option>
        </select>

        {/* Faction Filter */}
        <select
          value={selectedFaction}
          onChange={(e) => setSelectedFaction(e.target.value)}
          className="bg-[#1C2B4B] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">Tüm Fraksiyonlar</option>
          <option value="velisara-kingdom">Velisara Krallığı</option>
          <option value="eryndor-council">Eryndor Konseyi</option>
          <option value="karabuyu-tarikati">Karabüyü Tarikatı</option>
          <option value="anvilheim">Anvilheim</option>
          <option value="chaos">Kaos</option>
          <option value="order">Düzen</option>
          <option value="independent">Bağımsız</option>
          <option value="wild">Vahşi</option>
        </select>
      </div>
    </div>
  );
} 
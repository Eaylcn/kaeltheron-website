'use client';

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import CharacterFilters from '@/components/ui/CharacterFilters'

interface Character {
  id: string;
  type: string;
  category: string;
  race: string;
  faction: string;
  name: string;
  image: string;
  description: string;
  appearance: string;
  stats: string;
  abilities: string[];
  goal: string;
}

interface Faction {
  id: string;
  type: string;
  name: string;
  image: string;
  description: string;
  goal: string;
  details: {
    merkez: string;
    lider: string;
    uyeSayisi: string;
    etkiAlani: string;
    uzmanlik: string;
  };
  varliklar: string[];
}

const CharacterCard = ({ character }: { character: Character }) => {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 h-full">
            <h3 className="text-2xl font-hennyPenny text-yellow-300 mb-4 drop-shadow-[0_0_3px_rgba(234,179,8,0.3)]">
              {character.name}
            </h3>
            <div className="relative w-full h-64 mb-4">
              <Image
                src={`/characters${character.image}`}
                alt={character.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-2">Tanım</h4>
                <p className="font-risque text-gray-300">{character.description}</p>
              </div>
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-2">Görünüm</h4>
                <p className="font-risque text-gray-300">{character.appearance}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back Side */}
        <div className="flip-card-back">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 h-full flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-3">Statlar</h4>
                <p className="font-risque text-gray-300 whitespace-pre-line">
                  {character.stats}
                </p>
              </div>
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-3">Yetenekler</h4>
                <ul className="font-risque text-gray-300 list-disc list-inside">
                  {character.abilities.map((ability, index) => (
                    <li key={index}>{ability}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-3">Hedef</h4>
                <p className="font-risque text-gray-300">{character.goal}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FactionCard = ({ faction }: { faction: Faction }) => {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 h-full">
            <h3 className="text-2xl font-hennyPenny text-yellow-300 mb-4 drop-shadow-[0_0_3px_rgba(234,179,8,0.3)]">
              {faction.name}
            </h3>
            <div className="relative w-full h-64 mb-4">
              <Image
                src={`/characters${faction.image}`}
                alt={faction.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-2">Tanım</h4>
                <p className="font-risque text-gray-300">{faction.description}</p>
              </div>
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-2">Hedef</h4>
                <p className="font-risque text-gray-300">{faction.goal}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back Side */}
        <div className="flip-card-back">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 h-full flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-3">Detaylar</h4>
                <div className="font-risque text-gray-300 space-y-2">
                  <p><span className="text-amber-400">Merkez:</span> {faction.details.merkez}</p>
                  <p><span className="text-amber-400">Lider:</span> {faction.details.lider}</p>
                  <p><span className="text-amber-400">Üye Sayısı:</span> {faction.details.uyeSayisi}</p>
                  <p><span className="text-amber-400">Etki Alanı:</span> {faction.details.etkiAlani}</p>
                  <p><span className="text-amber-400">Uzmanlık:</span> {faction.details.uzmanlik}</p>
                </div>
              </div>
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-3">Varlıklar</h4>
                <ul className="font-risque text-gray-300 list-disc list-inside">
                  {faction.varliklar.map((varlik, index) => (
                    <li key={index}>{varlik}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CharactersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedFaction, setSelectedFaction] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [factions, setFactions] = useState<Faction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/characters');
        const data = await response.json();
        setCharacters(data.characters || []);
        setFactions(data.factions || []);
      } catch (error) {
        console.error('Failed to fetch characters:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        character.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || selectedType === 'character';
    const matchesCategory = !selectedCategory || character.category === selectedCategory;
    const matchesRace = !selectedRace || character.race === selectedRace;
    const matchesFaction = !selectedFaction || character.faction === selectedFaction;

    return matchesSearch && matchesType && matchesCategory && matchesRace && matchesFaction;
  });

  const filteredFactions = factions.filter(faction => {
    const matchesSearch = faction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        faction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || selectedType === 'faction';

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="text-white font-risque text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B1120]">
      {/* Hero Section */}
      <section className="relative h-[25vh] pt-12 flex items-center justify-center bg-gradient-to-b from-[#0B1120] via-[#162137] to-[#1C2B4B]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/90 via-[#162137]/80 to-[#1C2B4B]/90 z-10" />
          <Image
            src="/characters-bg.png"
            alt={`Kael'Theron'un Kahramanları`}
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-20 text-center">
          <h1 className="text-6xl font-hennyPenny text-white mb-4">
            {`Kael'Theron'un Kahramanları`}
          </h1>
          <p className="text-xl font-risque text-gray-200">
            {`Kael'theron'un efsanevi karakterleriyle tanışın`}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        {/* Filters */}
        <CharacterFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedRace={selectedRace}
          setSelectedRace={setSelectedRace}
          selectedFaction={selectedFaction}
          setSelectedFaction={setSelectedFaction}
        />

        {/* Content Grid */}
        <div className="space-y-20">
          {/* Characters Section */}
          {(!selectedType || selectedType === 'character') && filteredCharacters.length > 0 && (
            <section>
              <h2 className="text-4xl font-hennyPenny text-white mb-12">Karakterler</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredCharacters.map((character) => (
                  <CharacterCard key={character.id} character={character} />
                ))}
              </div>
            </section>
          )}

          {/* Factions Section */}
          {(!selectedType || selectedType === 'faction') && filteredFactions.length > 0 && (
            <section>
              <h2 className="text-4xl font-hennyPenny text-white mb-12">Fraksiyonlar</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredFactions.map((faction) => (
                  <FactionCard key={faction.id} faction={faction} />
                ))}
              </div>
            </section>
          )}

          {/* No Results Message */}
          {filteredCharacters.length === 0 && filteredFactions.length === 0 && (
            <div className="text-center text-gray-400 font-risque text-xl py-20">
              Arama kriterlerinize uygun sonuç bulunamadı.
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 
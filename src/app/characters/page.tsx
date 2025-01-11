'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CharactersHeroSection } from '@/components/characters/CharactersHeroSection';
import { CharacterCard } from '@/components/characters/CharacterCard';
import { FactionCard } from '@/components/characters/FactionCard';
import CharacterFilters from '@/components/ui/CharacterFilters';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { Character, Faction, CharactersData } from '@/types/characters';

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
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
      setSelectedType('character');
    }

    async function fetchData() {
      try {
        const response = await fetch('/api/characters');
        const data: CharactersData = await response.json();
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
                       character.id.toLowerCase().includes(searchTerm.toLowerCase());
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
    const matchesCategory = !selectedCategory || faction.type === selectedCategory;
    const matchesRegion = !selectedRace || faction.details.etkiAlani.toLowerCase().includes(selectedRace);
    const matchesExpertise = !selectedFaction || faction.details.uzmanlik === selectedFaction;

    return matchesSearch && matchesType && matchesCategory && matchesRegion && matchesExpertise;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-[#0B1120]">
      <CharactersHeroSection />

      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="mb-20">
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
        </div>

        <div className="space-y-20">
          {(!selectedType || selectedType === 'character') && filteredCharacters.length > 0 && (
            <section>
              <h2 className="text-4xl font-hennyPenny text-white mb-4">
                Karakterler
                <span className="text-2xl text-amber-400 ml-3">({filteredCharacters.length})</span>
              </h2>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredCharacters.map((character) => (
                    <CharacterCard key={character.id} character={character} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </section>
          )}

          {(!selectedType || selectedType === 'faction') && filteredFactions.length > 0 && (
            <section>
              <h2 className="text-4xl font-hennyPenny text-white mb-4">
                Fraksiyonlar
                <span className="text-2xl text-amber-400 ml-3">({filteredFactions.length})</span>
              </h2>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredFactions.map((faction) => (
                    <FactionCard key={faction.id} faction={faction} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </section>
          )}

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
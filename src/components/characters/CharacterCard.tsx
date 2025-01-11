import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

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

interface CharacterCardProps {
  character: Character;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="flip-card"
    >
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 h-full">
            <h3 className="text-2xl font-hennyPenny text-yellow-300 mb-4 drop-shadow-[0_0_3px_rgba(234,179,8,0.3)]">
              {character.name}
            </h3>
            <div className="relative w-full h-64 mb-8">
              <Image
                src={`/characters${character.image}`}
                alt={character.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-3">Tanım</h4>
                <p className="font-risque text-gray-300">{character.description}</p>
              </div>
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-3">Görünüm</h4>
                <p className="font-risque text-gray-300">{character.appearance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 h-full flex items-center justify-center">
            <div className="space-y-8 w-full">
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-4 text-center">Statlar</h4>
                <p className="font-risque text-gray-300 whitespace-pre-line text-center">
                  {character.stats}
                </p>
              </div>
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-4 text-center">Yetenekler</h4>
                <ul className="font-risque text-gray-300 list-none text-center">
                  {character.abilities.map((ability, index) => (
                    <li key={index} className="mb-2">{ability}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-4 text-center">Hedef</h4>
                <p className="font-risque text-gray-300 text-center">{character.goal}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 
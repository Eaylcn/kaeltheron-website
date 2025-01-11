import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FactionDetails {
  merkez: string;
  lider: string;
  uyeSayisi: string;
  etkiAlani: string;
  uzmanlik: string;
}

interface Faction {
  id: string;
  type: string;
  name: string;
  image: string;
  description: string;
  goal: string;
  details: FactionDetails;
  varliklar: string[];
}

interface FactionCardProps {
  faction: Faction;
}

export const FactionCard: React.FC<FactionCardProps> = ({ faction }) => {
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
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 h-full">
            <div className="space-y-6">
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-4">Detaylar</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-amber-300 font-risque">Merkez:</span>
                    <span className="text-gray-300 font-risque ml-2">{faction.details.merkez}</span>
                  </div>
                  <div>
                    <span className="text-amber-300 font-risque">Lider:</span>
                    <span className="text-gray-300 font-risque ml-2">{faction.details.lider}</span>
                  </div>
                  <div>
                    <span className="text-amber-300 font-risque">Üye Sayısı:</span>
                    <span className="text-gray-300 font-risque ml-2">{faction.details.uyeSayisi}</span>
                  </div>
                  <div>
                    <span className="text-amber-300 font-risque">Etki Alanı:</span>
                    <span className="text-gray-300 font-risque ml-2">{faction.details.etkiAlani}</span>
                  </div>
                  <div>
                    <span className="text-amber-300 font-risque">Uzmanlık:</span>
                    <span className="text-gray-300 font-risque ml-2">{faction.details.uzmanlik}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-hennyPenny text-yellow-200 mb-4">Varlıklar</h4>
                <ul className="list-disc list-inside space-y-2">
                  {faction.varliklar.map((varlik, index) => (
                    <li key={index} className="text-gray-300 font-risque">{varlik}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 
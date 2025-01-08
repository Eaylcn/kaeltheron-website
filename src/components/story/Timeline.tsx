'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  relatedCharacters: string[];
}

interface TimelineEra {
  id: string;
  era: string;
  year: string;
  title: string;
  description: string;
  detailedDescription: string;
  image: string;
  events: TimelineEvent[];
}

interface TimelineProps {
  data: TimelineEra[];
}

export default function Timeline({ data }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [expandedEras, setExpandedEras] = useState<string[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);

  const toggleEra = (eraId: string) => {
    setExpandedEras(prev => 
      prev.includes(eraId) 
        ? prev.filter(id => id !== eraId)
        : [...prev, eraId]
    );
  };

  const toggleEvent = (eventId: string) => {
    setExpandedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <div ref={containerRef} className="relative min-h-screen py-20">
      {/* Timeline Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500/20 via-amber-500 to-amber-500/20 transform -translate-x-1/2" />
      
      {/* Timeline Progress */}
      <motion.div 
        className="absolute left-1/2 top-0 bottom-0 w-1 bg-amber-400 transform -translate-x-1/2 origin-top"
        style={{ scaleY: scrollYProgress }}
      />

      {/* Eras */}
      <div className="relative max-w-7xl mx-auto px-4">
        {data.map((era, index) => (
          <motion.div
            key={era.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`relative mb-32 ${index % 2 === 0 ? 'ml-auto pl-8 md:pl-0 md:pr-32' : 'mr-auto pr-8 md:pr-0 md:pl-32'} w-full md:w-1/2`}
          >
            {/* Era Connector - Moved to top */}
            <div 
              className={`absolute -top-3 ${
                index % 2 === 0 
                  ? 'left-0 md:-left-6' 
                  : 'right-0 md:-right-6'
              } w-6 h-6`}
            >
              <div className="w-full h-full bg-amber-400 rounded-full" />
              <div className={`absolute top-1/2 ${
                index % 2 === 0 
                  ? 'left-6 md:left-full' 
                  : 'right-6 md:right-full'
              } w-8 md:w-24 h-0.5 bg-amber-400 transform -translate-y-1/2`} />
            </div>

            {/* Era Content */}
            <div className="bg-[#1C2B4B]/80 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
              {/* Era Header */}
              <div className="mb-6">
                <h3 className="text-3xl font-hennyPenny text-amber-400 mb-2">{era.era}</h3>
                <div className="text-lg font-risque text-gray-400">{era.year}</div>
              </div>

              {/* Era Image */}
              <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
                <Image
                  src={era.image}
                  alt={era.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C2B4B] to-transparent" />
              </div>

              {/* Era Description */}
              <div className="mb-6">
                <h4 className="text-xl font-hennyPenny text-white mb-3">{era.title}</h4>
                <p className="font-risque text-gray-300">{era.description}</p>
                <button
                  onClick={() => toggleEra(era.id)}
                  className="mt-4 text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2 font-risque"
                >
                  {expandedEras.includes(era.id) ? 'Daha az göster' : 'Devamını oku'}
                  <motion.div
                    animate={{ rotate: expandedEras.includes(era.id) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedEras.includes(era.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="font-risque text-gray-300 mt-4">{era.detailedDescription}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Era Events */}
              <div className="space-y-4">
                {era.events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-[#162137] rounded-lg p-4 hover:bg-[#162137]/80 transition-colors"
                  >
                    <h5 className="text-lg font-hennyPenny text-amber-300 mb-2">{event.title}</h5>
                    <p className="font-risque text-gray-400 mb-3">{event.description}</p>
                    <button
                      onClick={() => toggleEvent(event.id)}
                      className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2 font-risque mb-3"
                    >
                      {expandedEvents.includes(event.id) ? 'Daha az göster' : 'Devamını oku'}
                      <motion.div
                        animate={{ rotate: expandedEvents.includes(event.id) ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaChevronDown />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedEvents.includes(event.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="font-risque text-gray-300 mb-4">{event.detailedDescription}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {event.relatedCharacters.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {event.relatedCharacters.map((character) => (
                          <Link
                            key={character}
                            href={`/characters?search=${character}&type=character`}
                            className="text-sm font-risque text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            #{character}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 
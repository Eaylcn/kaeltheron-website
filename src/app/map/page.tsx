'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import MapWrapper from '@/components/map/MapWrapper';
import GeographyNavigation from '@/components/navigation/GeographyNavigation';

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#0B1120]">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center bg-gradient-to-b from-[#0B1120] via-[#162137] to-[#1C2B4B]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/90 via-[#162137]/80 to-[#1C2B4B]/90 z-10" />
          <Image
            src="/map-bg.png"
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

      {/* Content Container */}
      <div className="relative max-w-[1600px] mx-auto">
        {/* Main Content */}
        <div className="max-w-[1200px] mx-auto px-4 py-16">
          <div className="space-y-32">
            {/* Map Section */}
            <section id="map" className="scroll-mt-24 relative z-10">
              <MapWrapper />
            </section>

            {/* Geography Section */}
            <section id="geography" className="scroll-mt-24 bg-[#162137] rounded-lg p-8 shadow-lg">
              <h2 className="text-3xl font-hennyPenny text-yellow-300 mb-8 drop-shadow-[0_0_3px_rgba(234,179,8,0.3)]">
                Kael&apos;Theron&apos;un Coğrafyası
              </h2>
              
              {/* Merkez Bölgeler */}
              <div className="mb-12">
                <h3 className="text-2xl font-risque text-amber-300 mb-6">Merkez Bölgeler</h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-risque text-yellow-200 mb-3">Eryndor Ormanları</h4>
                    <p className="font-risque text-slate-200">
                      Elflerin yoğun olarak yaşadığı büyülü ve gizemli ormanlar. Derin vadilerle çevrili bu bölgede, 
                      kaotik büyü güçleri hissedilse de elfler için doğal bir koruma kalkanı oluşturuyor.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-risque text-yellow-200 mb-3">Kuzey Diken Tepeleri</h4>
                    <p className="font-risque text-slate-200">
                      İnsanların geniş yerleşimlerinin bulunduğu dağlık ve düzlük alanlar. 
                      Şehirler stratejik olarak nehirlerin kavşak noktalarına kurulmuş.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-risque text-yellow-200 mb-3">Anvilheim Zirvesi</h4>
                    <p className="font-risque text-slate-200">
                      Cücelerin devasa kaleleri ve yeraltı şehirlerinin merkezi. 
                      Anvilheim, zengin maden yataklarıyla ve cüce mühendisliğinin göz kamaştırıcı eserleriyle ünlü.
                    </p>
                  </div>
                </div>
              </div>

              {/* Doğal Sınırlar */}
              <div>
                <h3 className="text-2xl font-risque text-amber-300 mb-6">Doğal Sınırlar</h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-risque text-yellow-200 mb-3">Auroras Buz Çölü (Kuzey)</h4>
                    <p className="font-risque text-slate-200">
                      Sonsuzluğa uzanan bir beyazlık. Buzul devlerinin ve karanlık elementallerin ara sıra görüldüğü rivayet ediliyor.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-risque text-yellow-200 mb-3">Kasvetli Fırtına Okyanusu (Doğu)</h4>
                    <p className="font-risque text-slate-200">
                      Fırtınaların hiç dinmediği, devasa yaratıkların yaşadığı söylenen gizemli sular.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-risque text-yellow-200 mb-3">Güney Bataklıkları (Güney)</h4>
                    <p className="font-risque text-slate-200">
                      Kaosun hüküm sürdüğü, haritalandırılamayan ve sürekli değişen doğasıyla meşhur bölge.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar Container */}
        <div className="fixed top-1/2 -translate-y-1/2" style={{ left: 'calc(50% - 775px)' }}>
          <GeographyNavigation />
        </div>
      </div>
    </main>
  );
} 
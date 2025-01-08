import React from 'react';
import MapWrapper from '@/components/map/MapWrapper';
import GeographyNavigation from '@/components/navigation/GeographyNavigation';

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#0B1120]">
      {/* Hero Section */}
      <section className="relative h-[25vh] pt-12 flex items-center justify-center bg-gradient-to-b from-[#0B1120] via-[#162137] to-[#1C2B4B]">
        <div className="absolute inset-0 bg-[url('/map-bg.png')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120] via-[#162137]/80 to-[#1C2B4B]/80" />
        <div className="relative z-20 text-center">
          <h1 className="text-6xl font-hennyPenny text-white mb-4">
            Kael&apos;Theron Haritası
          </h1>
          <p className="text-xl font-risque text-gray-200">
            Efsanevi toprakları keşfedin
          </p>
        </div>
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
              <h2 className="text-3xl font-hennyPenny text-yellow-300 mb-8 drop-shadow-[0_0_3px_rgba(234,179,8,0.3)]">Kael&apos;Theron&apos;un Coğrafyası</h2>
              
              {/* Merkez Bölgeler */}
              <div className="mb-12">
                <h3 className="text-2xl font-risque text-amber-300 mb-6">Merkez Bölgeler</h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-risque text-yellow-200 mb-3">Eryndor Ormanları</h4>
                    <p className="font-risque text-slate-200">Elflerin yoğun olarak yaşadığı büyülü ve gizemli ormanlar. Derin vadilerle çevrili bu bölgede, kaotik büyü güçleri hissedilse de elfler için doğal bir koruma kalkanı oluşturuyor.</p>
                  </div>

                  <div>
                    <h4 className="text-xl font-risque text-yellow-200 mb-3">Kuzey Diken Tepeleri</h4>
                    <p className="font-risque text-slate-200">İnsanların geniş yerleşimlerinin bulunduğu dağlık ve düzlük alanlar. Şehirler stratejik olarak nehirlerin kavşak noktalarına kurulmuş.</p>
                  </div>

                  <div>
                    <h4 className="text-xl font-risque text-yellow-200 mb-3">Anvilheim Zirvesi</h4>
                    <p className="font-risque text-slate-200">Cücelerin devasa kaleleri ve yeraltı şehirlerinin merkezi. Anvilheim, zengin maden yataklarıyla ve cüce mühendisliğinin göz kamaştırıcı eserleriyle ünlü.</p>
                  </div>
                </div>
              </div>

              {/* Doğal Sınırlar */}
              <div>
                <h3 className="text-2xl font-risque text-amber-300 mb-6">Doğal Sınırlar</h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-risque text-yellow-200 mb-3">Auroras Buz Çölü (Kuzey)</h4>
                    <p className="font-risque text-slate-200">Sonsuzluğa uzanan bir beyazlık. Buzul devlerinin ve karanlık elementallerin ara sıra görüldüğü rivayet ediliyor.</p>
                  </div>

                  <div>
                    <h4 className="text-xl font-risque text-yellow-200 mb-3">Kasvetli Fırtına Okyanusu (Doğu)</h4>
                    <p className="font-risque text-slate-200">Fırtınaların hiç dinmediği, devasa yaratıkların yaşadığı söylenen gizemli sular.</p>
                  </div>

                  <div>
                    <h4 className="text-xl font-risque text-yellow-200 mb-3">Güney Bataklıkları (Güney)</h4>
                    <p className="font-risque text-slate-200">Kaosun hüküm sürdüğü, haritalandırılamayan ve sürekli değişen doğasıyla meşhur bölge.</p>
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
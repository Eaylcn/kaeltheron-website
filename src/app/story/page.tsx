import React from 'react'
import Image from 'next/image'
import StoryNavigation from '@/components/navigation/StoryNavigation'

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-[#0B1120]">
      {/* Hero Section */}
      <section className="relative h-[20vh] flex items-center justify-center bg-gradient-to-b from-[#0B1120] via-[#162137] to-[#1C2B4B]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/90 via-[#162137]/80 to-[#1C2B4B]/90 z-10" />
          <Image
            src="/story-bg.png"
            alt="Kael&apos;Theron Hikayesi"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-20 text-center">
          <h1 className="text-6xl font-hennyPenny text-white mb-4">
            Kael&apos;Theron&apos;un Hikayesi
          </h1>
          <p className="text-lg text-slate-300 mb-8">
            Kael&apos;theron&apos;un destansı hikayesini keşfedin.
          </p>
          <p className="text-base text-slate-400">
            &ldquo;Kadim güçlerin gölgesinde&rdquo; başlayan yolculuk...
          </p>
        </div>
      </section>

      {/* Content Container */}
      <div className="relative max-w-[1600px] mx-auto">
        {/* Sidebar Container */}
        <div className="fixed top-1/2 -translate-y-1/2" style={{ left: 'calc(50% - 775px)' }}>
          <StoryNavigation />
        </div>

        {/* Main Content */}
        <div className="max-w-[1200px] mx-auto px-4 py-16">
          <div className="space-y-40">
            {/* History Section */}
            <section id="history">
              <h2 className="text-4xl font-hennyPenny text-white mb-12">Kael&apos;Theron&apos;un Geçmişi</h2>
              <div className="space-y-12">
                {/* Büyük Kaos Dönemi */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8">
                  <h3 className="text-2xl font-hennyPenny text-yellow-300 mb-4 drop-shadow-[0_0_3px_rgba(234,179,8,0.3)]">Büyük Kaos Dönemi</h3>
                  <p className="font-risque text-slate-200 mb-6">
                    Yüzyıllar önce Kael&apos;Theron, kaosun merkezindeydi. Kadim bir büyü savaşı kıtanın coğrafyasını değiştirdi. 
                    Elfler, dwarflar ve insanlar güçlerini birleştirerek kaosu dizginlemeyi başardı. Bu ittifak, günümüz 
                    yönetim sisteminin temelini oluşturdu. Fakat Fırtına Okyanusu ve Buz Çölü, kaosun tamamen yok edilemediğinin 
                    canlı kanıtları.
                  </p>
                </div>

                {/* Tarihi Olaylar Timeline */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-hennyPenny text-yellow-300 mb-6 drop-shadow-[0_0_3px_rgba(234,179,8,0.3)]">Önemli Tarihi Olaylar</h3>
                  
                  {/* Kadim Kaos Savaşı */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="font-hennyPenny text-amber-300 whitespace-nowrap pt-1">500 Yıl Önce</div>
                      <div>
                        <h4 className="text-xl font-hennyPenny text-yellow-200 mb-2">Kadim Kaos Savaşı</h4>
                        <div className="space-y-4 font-risque text-slate-200">
                          <p>
                            Elfler, insanlar ve dwarflar, &quot;Kaos Lordu Nartharax&quot;a karşı güçlerini birleştirdi. 
                            Nartharax, büyünün saf enerjisini bozup dünya üzerinde fiziksel ve ruhsal kaos yaratıyordu.
                          </p>
                          <p>
                            <span className="text-amber-300 font-hennyPenny">Sonuç:</span> Üç ırk, &quot;Birlik Yemini&quot;ni 
                            ederek Nartharax&apos;ı &quot;Ebedi Prizma&quot; adlı kadim bir mühürle hapsetti. Ancak mühürleme büyüsü 
                            öyle güçlüydü ki dünyadaki büyü dengesi bozuldu.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Eryndor Sürgünleri */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="font-hennyPenny text-amber-300 whitespace-nowrap pt-1">300 Yıl Önce</div>
                      <div>
                        <h4 className="text-xl font-hennyPenny text-yellow-200 mb-2">Eryndor Sürgünleri</h4>
                        <div className="space-y-4 font-risque text-slate-200">
                          <p>
                            Elfler arasındaki iç savaş, bir grup büyücünün ormandan sürgün edilmesiyle sonuçlandı. 
                            Bu büyücüler, kaotik büyü deneyleriyle uğraşarak kuzeyin karanlık bölgelerine sığındı.
                          </p>
                          <p>
                            <span className="text-amber-300 font-hennyPenny">Sonuç:</span> Sürgün edilen büyücüler 
                            zamanla &quot;Karabüyü Tarikatı&quot;nı kurdu ve Auroras Buz Çölü&apos;nde karanlık ritüellerini sürdürdü.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Velisara Diplomasi Krizi */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="font-hennyPenny text-amber-300 whitespace-nowrap pt-1">50 Yıl Önce</div>
                      <div>
                        <h4 className="text-xl font-hennyPenny text-yellow-200 mb-2">Velisara Diplomasi Krizi</h4>
                        <div className="space-y-4 font-risque text-slate-200">
                          <p>
                            İnsanlar, elflerin büyü gücünü sınırlamak için diplomatik girişimde bulundu. 
                            Dwarfların da desteklediği bu girişim, elfler tarafından tehdit olarak algılandı.
                          </p>
                          <p>
                            <span className="text-amber-300 font-hennyPenny">Sonuç:</span> Diplomatik çabalar 
                            Birlik Yemini&apos;ni zedelemedi, ancak üç ırk arasındaki güveni sarstı.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Current Events Section */}
            <section id="current-events">
              <h2 className="text-4xl font-hennyPenny text-yellow-300 mb-12 drop-shadow-[0_0_3px_rgba(234,179,8,0.3)]">Günümüzdeki Gelişmeler</h2>
              <div className="space-y-8">
                {/* Auroras Buz Çölü'ndeki Keşif */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="text-xl font-hennyPenny text-yellow-200 mb-2">Auroras Buz Çölü&apos;ndeki Keşif</h4>
                  <div className="space-y-4 font-risque text-slate-200">
                    <p>
                      Cüce madenciler, buzulların altında kadim bir tapınak ve içinde mühürlenmiş bir enerji kaynağı keşfetti.
                    </p>
                    <p>
                      <span className="text-amber-300 font-hennyPenny">Sonuç:</span> Kazad-Gron&apos;un lideri tapınağı mühürlü 
                      tutmak isterken, bazı cüce lordları bu enerjiyi kullanarak büyüden bağımsız bir güç yaratmayı planlıyor. 
                      Tarikat ise kaynağı ele geçirmeye çalışıyor.
                    </p>
                  </div>
                </div>

                {/* Kasvetli Fırtına Okyanusu'ndaki Tehdit */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="text-xl font-hennyPenny text-yellow-200 mb-2">Kasvetli Fırtına Okyanusu&apos;ndaki Tehdit</h4>
                  <div className="space-y-4 font-risque text-slate-200">
                    <p>
                      Denizciler, fırtınalar arasında &quot;Leviathan&quot; adlı devasa bir yaratık gördüklerini bildiriyor. 
                      Ayrıca &quot;Derin Halk&quot; olarak bilinen deniz ırkının gemilere saldırdığı söyleniyor.
                    </p>
                    <p>
                      <span className="text-amber-300 font-hennyPenny">Sonuç:</span> Velisara, deniz ticaret yollarını 
                      korumak için donanmasını güçlendiriyor. Bu durum cücelerin ve elflerin kıtalar arası ticaretini 
                      sekteye uğratıyor.
                    </p>
                  </div>
                </div>

                {/* Eryndor'daki Büyü Çatışmaları */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="text-xl font-hennyPenny text-yellow-200 mb-2">Eryndor&apos;daki Büyü Çatışmaları</h4>
                  <div className="space-y-4 font-risque text-slate-200">
                    <p>
                      Ormanda, büyüyü sınırlamak isteyen elf fraksiyonu ile gelenekçi elf büyücüleri arasında çatışma çıktı.
                    </p>
                    <p>
                      <span className="text-amber-300 font-hennyPenny">Sonuç:</span> Büyü Konseyi ikiye bölündü. 
                      Bu bölünme, tarikatların ormana sızmasını kolaylaştırıyor.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Future Section */}
            <section id="future">
              <h2 className="text-4xl font-hennyPenny text-yellow-300 mb-12 drop-shadow-[0_0_3px_rgba(234,179,8,0.3)]">Kael&apos;Theron&apos;un Geleceği</h2>
              <div className="space-y-12 mb-80">
                <h3 className="text-2xl font-hennyPenny text-yellow-200 mb-6">Yaklaşan Tehditler</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Nartharax'ın Uyanışı */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="text-xl font-hennyPenny text-yellow-200 mb-4">Nartharax&apos;ın Uyanışı</h4>
                    <div className="space-y-4 font-risque text-slate-200">
                      <p>
                        &quot;Ebedi Prizma&quot;daki mühür zayıflıyor. Auroras Buz Çölü&apos;ndeki tapınak, Nartharax&apos;ın hapishanesine 
                        açılan bir kapı olabilir.
                      </p>
                      <p>
                        <span className="text-amber-300 font-hennyPenny">Sonuç:</span> Mühür kırılırsa dünya yeniden kaosa 
                        sürüklenecek. Üç ırkın liderleri bu tehdidi görmezden geliyor.
                      </p>
                    </div>
                  </div>

                  {/* Kaos Tarikatlarının Yükselişi */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="text-xl font-hennyPenny text-yellow-200 mb-4">Kaos Tarikatlarının Yükselişi</h4>
                    <div className="space-y-4 font-risque text-slate-200">
                      <p>
                        Karabüyü Tarikatı ve diğer kaos grupları giderek güçleniyor. Amaçları büyüyü kullanarak dünyayı 
                        kaotik bir düzene sokmak.
                      </p>
                      <p>
                        <span className="text-amber-300 font-hennyPenny">Sonuç:</span> Tarikatlar, Fırtına Okyanusu&apos;ndaki 
                        Leviathan ile bağlantı kurmaya çalışıyor.
                      </p>
                    </div>
                  </div>

                  {/* Birlik Yeminini Zedeleyen İhanet */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="text-xl font-hennyPenny text-yellow-200 mb-4">Birlik Yeminini Zedeleyen İhanet</h4>
                    <div className="space-y-4 font-risque text-slate-200">
                      <p>
                        Üç ırk arasındaki gerginlik, eski ittifakın çözülmesine yol açabilir. Bu durum tarikatların ve 
                        kaosun güçlenmesini kolaylaştıracak.
                      </p>
                      <p>
                        <span className="text-amber-300 font-hennyPenny">Sonuç:</span> Politik entrikalar ve gizli ittifaklar 
                        kıtanın kaderini belirleyecek.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
} 
import React from 'react'
import Image from 'next/image'
import CharacterNavigation from '@/components/navigation/CharacterNavigation'

export default function CharactersPage() {
  return (
    <main className="min-h-screen bg-[#0B1120]">
      {/* Hero Section */}
      <section className="relative h-[20vh] flex items-center justify-center bg-gradient-to-b from-[#0B1120] via-[#162137] to-[#1C2B4B]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/90 via-[#162137]/80 to-[#1C2B4B]/90 z-10" />
          <Image
            src="/characters-bg.png"
            alt="Kael&apos;Theron&apos;un Kahramanları"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-20 text-center">
          <h1 className="text-6xl font-hennyPenny text-white mb-4">
            Kael&apos;Theron&apos;un Kahramanları
          </h1>
          <p className="text-lg text-slate-300">
            Kael&apos;theron&apos;un efsanevi karakterleriyle tanışın
          </p>
        </div>
      </section>

      {/* Content Container */}
      <div className="relative max-w-[1600px] mx-auto">
        {/* Sidebar Container */}
        <div className="fixed top-1/2 -translate-y-1/2" style={{ left: 'calc(50% - 840px)' }}>
          <CharacterNavigation />
        </div>

        {/* Main Content */}
        <div className="max-w-[1200px] mx-auto px-4 py-16">
          <div className="space-y-40">
            {/* Race Leaders Section */}
            <section id="race-leaders">
              <h2 className="text-4xl font-hennyPenny text-white mb-12">Liderler</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cassian Velaris */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-yellow-300 mb-4 drop-shadow-[0_0_3px_rgba(234,179,8,0.3)]">
                    Cassian Velaris
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-yellow-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        İnsanların lideri ve Velisara&apos;nın Kralı
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-yellow-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Asil duruşlu, diplomatik ve karizmatik bir insan
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-yellow-200 mb-2">Hedef</h4>
                      <p className="font-risque text-gray-300">
                        İnsanların çıkarlarını korumak ve ırklar arası dengeyi sağlamak
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-yellow-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        Level 10 Bard (College of Eloquence)
                        <br />
                        HP: 85 (10d8 + 30)
                        <br />
                        AC: 16 (Studded Leather + Dex)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-yellow-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Diplomatik Dokunuş</li>
                        <li>İlham Verici Lider</li>
                        <li>Büyülü Müzik</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Durnik Anvilstone */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-yellow-300 mb-4 drop-shadow-[0_0_3px_rgba(234,179,8,0.3)]">
                    Durnik Anvilstone
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-yellow-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        Cücelerin kralı ve Anvilheim&apos;ın yöneticisi
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-yellow-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Güçlü yapılı, savaş çekici taşıyan, zırhlı bir cüce
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-yellow-200 mb-2">Hedef</h4>
                      <p className="font-risque text-gray-300">
                        Cüce krallığını güçlendirmek ve teknolojik üstünlük sağlamak
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-yellow-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        Level 12 Fighter (Battle Master)
                        <br />
                        HP: 120 (12d10 + 48)
                        <br />
                        AC: 20 (Plate + Shield)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-yellow-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Savaş Ustası</li>
                        <li>Mühendislik Dehası</li>
                        <li>Liderlik</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Lorianthal Sylvaris */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-yellow-300 mb-4 drop-shadow-[0_0_3px_rgba(234,179,8,0.3)]">
                    Lorianthal Sylvaris
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-yellow-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        Elflerin lideri ve Eryndor Konseyi&apos;nin başkanı
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-yellow-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Zarif, bilge bakışlı, büyülü asasıyla dolaşan bir elf
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-yellow-200 mb-2">Hedef</h4>
                      <p className="font-risque text-gray-300">
                        Büyü geleneklerini korumak ve kaos tehdidini engellemek
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-yellow-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        Level 14 Wizard (Abjuration)
                        <br />
                        HP: 100 (14d6 + 42)
                        <br />
                        AC: 16 (Mage Armor + Shield)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-yellow-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Büyü Kalkanı</li>
                        <li>Büyü Ustalığı</li>
                        <li>Bilgelik Aurası</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Legends Section */}
            <section id="legends">
              <h2 className="text-4xl font-hennyPenny text-white mb-12">Efsaneler</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Kaos Lordu Nartharax */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-red-300 mb-4 drop-shadow-[0_0_3px_rgba(220,38,38,0.3)]">
                    Kaos Lordu Nartharax
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        Antik çağlardan kalma güçlü bir kaos varlığı
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Devasa, kara pullu, kızıl gözlü ejderha formu
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Hedef</h4>
                      <p className="font-risque text-gray-300">
                        Dünyayı kaosa sürüklemek ve tüm düzeni yok etmek
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        Ancient Chaos Dragon
                        <br />
                        HP: 450 (25d20 + 200)
                        <br />
                        AC: 22 (Natural Armor)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Kaos Nefesi</li>
                        <li>Gerçeklik Çarpıtma</li>
                        <li>Düzen Yıkımı</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Fırtına Leviathanı */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-red-300 mb-4 drop-shadow-[0_0_3px_rgba(220,38,38,0.3)]">
                    Fırtına Leviathanı
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        Derin denizlerin kadim bekçisi
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Devasa, mavi pullu, deniz yılanı benzeri yaratık
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Hedef</h4>
                      <p className="font-risque text-gray-300">
                        Denizlerin dengesini korumak ve istilacıları cezalandırmak
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        Mythical Sea Creature
                        <br />
                        HP: 400 (20d20 + 180)
                        <br />
                        AC: 20 (Natural Armor)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Fırtına Çağırma</li>
                        <li>Tsunami Dalgası</li>
                        <li>Deniz Hakimiyeti</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Arathion Duskthorn */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-red-300 mb-4 drop-shadow-[0_0_3px_rgba(220,38,38,0.3)]">
                    Arathion Duskthorn
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        Eryndor Sürgünü ve Karabüyü Tarikatı&apos;nın kurucusu
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Uzun, soluk tenli, üzerinde siyah ve gri tonlarda dalgalanan bir pelerin var. Gözleri kaos enerjisiyle parlayan koyu mor renkte
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Hedef</h4>
                      <p className="font-risque text-gray-300">
                        Kaosu dünyaya salarak düzeni yıkmak ve kendisini büyüden beslenen bir yarı-tanrıya dönüştürmek
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        Level 18 Sorcerer (Shadow Magic Origin)
                        <br />
                        HP: 145 (18d6 + 54)
                        <br />
                        AC: 15 (Mage Armor)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Gölge Yürüyüşü</li>
                        <li>Kaotik Enerji Patlaması</li>
                        <li>Kaos Mantosu</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Azuris */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-red-300 mb-4 drop-shadow-[0_0_3px_rgba(220,38,38,0.3)]">
                    Kadim Ejderha Kralı Azuris
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        Kael&apos;Theron&apos;un ilk çağlarından kalma, metalik ejderhaların efsanevi kralı
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Altın ve gümüş pullu, görkemli kanatları olan devasa ejderha. Gözleri yıldızlar gibi parlıyor
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Hedef</h4>
                      <p className="font-risque text-gray-300">
                        Düzenin ve dengenin koruyucusu olarak Nartharax&apos;ın yükselişini engellemek
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        Ancient Metallic Dragon
                        <br />
                        HP: 500 (25d20 + 250)
                        <br />
                        AC: 23 (Natural Armor)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-red-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Kutsal Alev</li>
                        <li>Düzen Kalkanı</li>
                        <li>Ejderha Hükümranlığı</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Factions Section */}
            <section id="factions">
              <h2 className="text-4xl font-hennyPenny text-white mb-12">Fraksiyonlar</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Karabüyü Tarikatı */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-blue-300 mb-4 drop-shadow-[0_0_3px_rgba(147,197,253,0.3)]">
                    Karabüyü Tarikatı
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-blue-200 mb-2">Lider</h4>
                      <p className="font-risque text-gray-300">
                        Arathion Duskthorn (Level 18 Sorcerer)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-blue-200 mb-2">Merkez</h4>
                      <p className="font-risque text-gray-300">
                        Auroras Buz Çölü&apos;nün derinliklerindeki gizli tapınak
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-blue-200 mb-2">Hedef</h4>
                      <p className="font-risque text-gray-300">
                        Kaotik büyüyü yaymak ve düzeni yıkmak
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-blue-200 mb-2">Alt Birimler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Gölge Ajanları</li>
                        <li>Kaos Savaşçıları</li>
                        <li>Ritüel Ustaları</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Eryndor Konseyi */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-blue-300 mb-4 drop-shadow-[0_0_3px_rgba(147,197,253,0.3)]">
                    Eryndor Konseyi
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-blue-200 mb-2">Lider</h4>
                      <p className="font-risque text-gray-300">
                        Lorianthal Sylvaris (Level 14 Wizard)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-blue-200 mb-2">Merkez</h4>
                      <p className="font-risque text-gray-300">
                        Sylvaris, Eryndor Ormanlarının kalbindeki büyülü şehir
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-blue-200 mb-2">Hedef</h4>
                      <p className="font-risque text-gray-300">
                        Büyü geleneklerini korumak ve kaos tehdidini engellemek
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-blue-200 mb-2">Alt Birimler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Büyü Muhafızları</li>
                        <li>Bilgi Arayıcıları</li>
                        <li>Düzen Koruyucuları</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Faction Members Section */}
            <section id="faction-members">
              <h2 className="text-4xl font-hennyPenny text-white mb-12">Fraksiyon Üyeleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Maldrak Thornsoul */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-purple-300 mb-4 drop-shadow-[0_0_3px_rgba(147,197,253,0.3)]">
                    Maldrak Thornsoul
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Fraksiyon</h4>
                      <p className="font-risque text-red-400">
                        Karabüyü Tarikatı
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        Tarikatın önde gelen ruh çağırıcısı
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Mor ve siyah cübbeli, solgun tenli büyücü
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Hedef</h4>
                      <p className="font-risque text-gray-300">
                        Ruh dünyasının sırlarını keşfetmek ve güç toplamak
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        Level 12 Warlock (Undead Patron)
                        <br />
                        HP: 95 (12d8 + 36)
                        <br />
                        AC: 15 (Mage Armor)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Ruh Çağırma</li>
                        <li>Gölge Büyüsü</li>
                        <li>Yaşam Çalma</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Sylvanna Nightshade */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-purple-300 mb-4 drop-shadow-[0_0_3px_rgba(147,197,253,0.3)]">
                    Sylvanna Nightshade
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Fraksiyon</h4>
                      <p className="font-risque text-red-400">
                        Karabüyü Tarikatı
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        Tarikatın gizli operasyonlar uzmanı
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Siyah deri zırhlı, gölgeler içinde hareket eden suikastçı
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Hedef</h4>
                      <p className="font-risque text-gray-300">
                        Tarikat için bilgi toplamak ve düşmanları ortadan kaldırmak
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        Level 10 Rogue (Assassin)
                        <br />
                        HP: 80 (10d8 + 30)
                        <br />
                        AC: 17 (Studded Leather + Dex)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Gölge Adımı</li>
                        <li>Ölümcül Vuruş</li>
                        <li>Zehir Ustası</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Thalindra Elaris */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-purple-300 mb-4 drop-shadow-[0_0_3px_rgba(147,197,253,0.3)]">
                    Thalindra Elaris
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Fraksiyon</h4>
                      <p className="font-risque text-blue-400">
                        Eryndor Konseyi
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        Büyü Muhafızı ve Konsey&apos;in baş büyücüsü
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Mor ve siyah cübbeli, solgun tenli büyücü
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Hedef</h4>
                      <p className="font-risque text-gray-300">
                        Ruh dünyasının sırlarını keşfetmek ve güç toplamak
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        Level 12 Warlock (Undead Patron)
                        <br />
                        HP: 95 (12d8 + 36)
                        <br />
                        AC: 15 (Mage Armor)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-purple-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Ruh Çağırma</li>
                        <li>Gölge Büyüsü</li>
                        <li>Yaşam Çalma</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Creatures Section */}
            <section id="creatures">
              <h2 className="text-4xl font-hennyPenny text-white mb-12">Yaratıklar</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Orman Kurdu */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-green-300 mb-4 drop-shadow-[0_0_3px_rgba(34,197,94,0.3)]">
                    Orman Kurdu
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        Eryndor Ormanları&apos;nda yaşayan vahşi kurt
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Normal kurtlardan daha büyük, gümüş tüylü
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        CR 1 (Beast)
                        <br />
                        HP: 25 (4d8 + 8)
                        <br />
                        AC: 11 (Natural Armor)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Keskin Duyu</li>
                        <li>Sürü Taktiği</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Buz Örümceği */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-green-300 mb-4 drop-shadow-[0_0_3px_rgba(34,197,94,0.3)]">
                    Buz Örümceği
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        Auroras Buz Çölü&apos;nde yaşayan tehlikeli örümcek
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Kristal benzeri buz kabuklu, mavi gözlü
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        CR 2 (Beast)
                        <br />
                        HP: 32 (5d8 + 10)
                        <br />
                        AC: 12 (Natural Armor)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Buz Zehri</li>
                        <li>Tırmanma</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bataklık Sülüğü */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-green-300 mb-4 drop-shadow-[0_0_3px_rgba(34,197,94,0.3)]">
                    Bataklık Sülüğü
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        Güney Bataklıkları&apos;nda yaşayan dev sülük
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Yeşilimsi kahverengi, 1 metre uzunluğunda
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        CR 1/2 (Beast)
                        <br />
                        HP: 22 (4d8 + 4)
                        <br />
                        AC: 10 (Natural Armor)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Kan Emme</li>
                        <li>Amfibi</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Çöl Akrebi */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-green-300 mb-4 drop-shadow-[0_0_3px_rgba(34,197,94,0.3)]">
                    Çöl Akrebi
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        Kuzey Diken Tepeleri&apos;nin kumlu bölgelerinde yaşayan zehirli akrep
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Kum rengi, 30 cm boyunda, keskin kıskaçlı
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        CR 1/4 (Beast)
                        <br />
                        HP: 15 (3d6 + 3)
                        <br />
                        AC: 11 (Natural Armor)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Zehirli İğne</li>
                        <li>Kum Gizlenme</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Mağara Yarasası */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-green-300 mb-4 drop-shadow-[0_0_3px_rgba(34,197,94,0.3)]">
                    Mağara Yarasası
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        Anvilheim Zirvesi&apos;nin mağaralarında yaşayan büyük yarasa
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Siyah tüylü, 1 metre kanat açıklığı, keskin dişli
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        CR 1/8 (Beast)
                        <br />
                        HP: 12 (2d8 + 2)
                        <br />
                        AC: 9 (Natural Armor)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Yankı Konumu</li>
                        <li>Karanlık Görüş</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Orman Tilkisi */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-2xl font-hennyPenny text-green-300 mb-4 drop-shadow-[0_0_3px_rgba(34,197,94,0.3)]">
                    Orman Tilkisi
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Tanım</h4>
                      <p className="font-risque text-gray-300">
                        Eryndor Ormanları&apos;nda yaşayan kurnaz tilki
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Görünüm</h4>
                      <p className="font-risque text-gray-300">
                        Kızıl tüylü, ince yapılı, parlak gözlü
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Statlar</h4>
                      <p className="font-risque text-gray-300">
                        CR 0 (Beast)
                        <br />
                        HP: 8 (2d6)
                        <br />
                        AC: 10 (Natural Armor)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-hennyPenny text-green-200 mb-2">Yetenekler</h4>
                      <ul className="font-risque text-gray-300 list-disc list-inside">
                        <li>Koku Alma</li>
                        <li>Çeviklik</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
} 
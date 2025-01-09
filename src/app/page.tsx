'use client';

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaDiceD20, FaPaintBrush, FaRobot, FaBrain, FaUsers, FaDragon, FaMagic, FaMap } from 'react-icons/fa'

export default function HomePage() {
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const testimonialRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-feature-show');
          } else {
            entry.target.classList.remove('animate-feature-show');
            void (entry.target as HTMLElement).offsetHeight;
          }
        });
      },
      { 
        threshold: 0.2,
        rootMargin: "-100px"
      }
    );

    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    testimonialRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-[#0B1120] overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120] via-[#162137]/95 to-[#1C2B4B]/90 z-10" />
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            poster="/hero-poster.jpg"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="relative z-20 w-full animate-fade-in">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left space-y-8 animate-slide-up">
                <h1 className="text-7xl font-hennyPenny text-white mb-6 leading-tight opacity-0 animate-title">
                  {"Kael'Theron'da"}<br />
                  <span className="text-white">
                    <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 text-transparent bg-clip-text">Yapay Zeka</span> ile
                  </span><br />
                  Maceraya Atıl
                </h1>
                <p className="text-xl font-risque text-slate-200 leading-relaxed opacity-0 animate-description">
                  {"Yapay zeka DM'liğinde, sınırsız hayal gücü ve gerçek zamanlı görsel üretimi ile her an benzersiz bir deneyim yaşayın."}
                </p>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <button 
                    onClick={() => {
                      const authModal = document.getElementById('auth-modal');
                      if (authModal) {
                        authModal.click();
                      }
                    }}
                    className="hover-glow group relative inline-flex items-center justify-center px-8 py-4 font-risque text-xl overflow-hidden rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 w-full h-full transition-all duration-300 group-hover:scale-105 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 opacity-100"></div>
                    <div className="absolute inset-0 w-full h-full transition-all duration-300 group-hover:scale-105 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 opacity-0 group-hover:opacity-100"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <span className="relative text-white font-medium tracking-wider group-hover:tracking-widest transition-all duration-300">Maceraya Başla</span>
                  </button>
                  <Link 
                    href="/about" 
                    className="hover-glow group relative inline-flex items-center justify-center px-8 py-4 font-risque text-lg overflow-hidden rounded-xl border-2 border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/0 via-amber-500/30 to-amber-500/0 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <span className="relative text-amber-300 group-hover:text-amber-200 transition-all duration-300 group-hover:tracking-wider">Daha Fazla Bilgi</span>
                  </Link>
                </div>
              </div>
              <div className="relative hidden md:block">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-3xl blur-3xl" />
                <div className="relative">
                  <Image
                    src="/hero-character.png"
                    alt="AI Generated Character"
                    width={600}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 mt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#162137]/10 to-transparent opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-hennyPenny text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 mb-4 leading-relaxed py-2">
              Yeni Nesil FRP Deneyimi
            </h2>
            <p className="text-xl font-risque text-slate-300 max-w-3xl mx-auto">
              Yapay zeka teknolojisi ile güçlendirilmiş, benzersiz bir fantastik rol yapma oyunu deneyimi
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaRobot size={48} className="text-amber-400" />,
                title: "Yapay Zeka DM",
                description: `Yapay zeka DM'imiz, oyun stilinizi öğrenir ve tercihlerinize göre hikayeyi şekillendirir. Her seçiminiz dünyayı etkiler, her kararınız yeni maceralar doğurur. Klasik FRP'nin özgürlüğünü yapay zeka teknolojisiyle birleştiren benzersiz bir deneyim.`,
                gradient: "from-purple-500 to-indigo-500"
              },
              {
                icon: <FaPaintBrush size={48} className="text-amber-400" />,
                title: "AI Görsel Üretimi",
                description: `Karakterinizin portresinden, bulunduğunuz ortamın detaylı görsellerine kadar her şey yapay zeka tarafından anında oluşturulur. NPC'ler, yaratıklar ve özel mekanlar için benzersiz görseller üretilir. Hayal gücünüz artık görsellerle hayat buluyor.`,
                gradient: "from-amber-500 to-yellow-500"
              },
              {
                icon: <FaDragon size={48} className="text-amber-400" />,
                title: "Dinamik Dünya",
                description: `Kael'Theron, seçimlerinizle şekillenen canlı bir dünya. Aldığınız her karar politik dengeleri değiştirir, her eylem tarihi yeniden yazar. Şehirler gelişir, ittifaklar kurulur, düşmanlar yükselir - hepsi sizin eylemlerinize bağlı olarak.`,
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                icon: <FaMagic size={48} className="text-amber-400" />,
                title: "Büyülü Sistem",
                description: "Geleneksel büyü sistemlerinin ötesinde, yapay zeka destekli bir büyü yaratma mekanizması. Elementleri birleştirin, yeni etkiler keşfedin. Her büyücü kendi özgün büyü stilini geliştirebilir, her büyü benzersiz etkiler yaratabilir.",
                gradient: "from-pink-500 to-rose-500"
              },
              {
                icon: <FaUsers size={48} className="text-amber-400" />,
                title: "Çok Oyunculu",
                description: `Arkadaşlarınızla birlikte destansı maceralara atılın. Yapay zeka DM'imiz grup dinamiklerini analiz eder, her oyuncunun tercihlerini göz önünde bulundurur. Ortak kararlarınız dünyayı şekillendirir, birlikte efsaneler yazarsınız.`,
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <FaMap size={48} className="text-amber-400" />,
                title: "Geniş Dünya",
                description: "Binlerce yıllık tarihi, derin mitolojisi ve keşfedilmeyi bekleyen gizemleriyle devasa bir dünya. Antik harabelerde kayıp hazineler, gizli vadilerde unutulmuş sırlar, yeraltı şehirlerinde kadim tehlikeler sizi bekliyor.",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                ref={(el) => {
                  if (el) featureRefs.current[index] = el;
                }}
                className="feature-card group relative p-5 rounded-2xl transition-all duration-500 opacity-0"
              >
                <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 transition-all duration-500 group-hover:border-amber-500/30 group-hover:bg-white/10" />
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 rounded-2xl transition-all duration-500" style={{ backgroundImage: `linear-gradient(to right, ${feature.gradient})` }} />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 group-hover:via-amber-500/10" />
                <div className="relative">
                  <div className="w-fit relative mb-4">
                    <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="relative z-10">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-hennyPenny text-yellow-200 mb-3 transition-colors duration-500 group-hover:text-amber-300">{feature.title}</h3>
                  <p className="font-risque text-slate-300 transition-colors duration-500 group-hover:text-slate-200">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="relative py-32 bg-gradient-to-b from-[#0B1120] via-[#162137] to-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-hennyPenny text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 leading-tight">
                Yapay Zeka ile<br />Sınırsız Macera
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                    <FaBrain className="text-2xl text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-hennyPenny text-yellow-200 mb-2">Öğrenen DM</h3>
                    <p className="font-risque text-slate-300">Oyun stilinizi analiz eder, tercihlerinize göre hikayeyi şekillendirir</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                    <FaPaintBrush className="text-2xl text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-hennyPenny text-yellow-200 mb-2">Görsel Zenginlik</h3>
                    <p className="font-risque text-slate-300">Her karakter ve mekan için özel üretilmiş, benzersiz görseller</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                    <FaDiceD20 className="text-2xl text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-hennyPenny text-yellow-200 mb-2">Özgür Oynanış</h3>
                    <p className="font-risque text-slate-300">{"Klasik FRP'nin özgürlüğü, modern teknolojinin gücüyle birleşiyor"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-3xl blur-3xl" />
              <div className="relative">
                <Image
                  src="/showcase-character.png"
                  alt="AI Generated Character"
                  width={600}
                  height={600}
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120] via-[#162137]/20 to-[#0B1120] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-hennyPenny text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 mb-4">
              Oyuncularımızın Deneyimleri
            </h2>
            <p className="text-xl font-risque text-slate-300 max-w-3xl mx-auto">
              Kael&apos;Theron&apos;da maceraya atılan oyuncuların hikayeleri
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Eren Yıldız",
                role: "Elf Büyücü",
                quote: '"Yapay zeka DM\'in dinamik hikaye anlatımı ve anlık görsel üretimi sayesinde her oyun benzersiz bir deneyime dönüşüyor."',
                image: "/testimonials/player1.jpg"
              },
              {
                name: "Zeynep Akar",
                role: "İnsan Savaşçı",
                quote: '"Karakterimin her kararının dünyayı etkilediğini görmek ve bunun sonuçlarıyla yüzleşmek inanılmaz bir deneyim."',
                image: "/testimonials/player2.jpg"
              },
              {
                name: "Kaan Demir",
                role: "Cüce Paladin",
                quote: '"Arkadaşlarımla birlikte keşfettiğimiz bu dünyada her macera beklenmedik sürprizlerle dolu."',
                image: "/testimonials/player3.jpg"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                ref={(el) => {
                  if (el) testimonialRefs.current[index] = el;
                }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-8 hover:bg-white/10 transition-all duration-300 opacity-0 translate-y-8"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-20 h-20 group">
                    {/* Outer glow and border */}
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full opacity-75 group-hover:opacity-100 blur-sm transition-all duration-300" />
                    
                    {/* Inner container */}
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-amber-400">
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/40 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Image */}
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <blockquote className="font-risque text-slate-200 italic mb-6">
                    {testimonial.quote}
                  </blockquote>
                  <div>
                    <cite className="font-hennyPenny text-amber-300 text-lg not-italic">
                      {testimonial.name}
                    </cite>
                    <p className="font-risque text-slate-400 text-sm mt-1">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <button className="hover-glow group relative inline-flex items-center justify-center px-8 py-4 font-risque text-lg overflow-hidden rounded-xl border-2 border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 hover:scale-105">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/0 via-amber-500/30 to-amber-500/0 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <span className="relative text-amber-300 group-hover:text-amber-200 transition-all duration-300 group-hover:tracking-wider">Tüm Hikayeleri Gör</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

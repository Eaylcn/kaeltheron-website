import React, { useRef, useEffect, ReactElement } from 'react';
import { FaRobot, FaPaintBrush, FaDragon, FaMagic, FaUsers, FaMap } from 'react-icons/fa';

interface Feature {
  icon: ReactElement;
  title: string;
  description: string;
  gradient: string;
}

const features: Feature[] = [
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
];

export const FeaturesSection = () => {
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

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

    return () => observer.disconnect();
  }, []);

  return (
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
          {features.map((feature, index) => (
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
  );
}; 
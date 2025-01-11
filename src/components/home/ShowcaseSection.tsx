import React from 'react';
import Image from 'next/image';
import { FaBrain, FaPaintBrush, FaDiceD20 } from 'react-icons/fa';

interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <FaBrain className="text-2xl text-amber-400" />,
    title: "Öğrenen DM",
    description: "Oyun stilinizi analiz eder, tercihlerinize göre hikayeyi şekillendirir"
  },
  {
    icon: <FaPaintBrush className="text-2xl text-amber-400" />,
    title: "Görsel Zenginlik",
    description: "Her karakter ve mekan için özel üretilmiş, benzersiz görseller"
  },
  {
    icon: <FaDiceD20 className="text-2xl text-amber-400" />,
    title: "Özgür Oynanış",
    description: "Klasik FRP'nin özgürlüğü, modern teknolojinin gücüyle birleşiyor"
  }
];

export const ShowcaseSection = () => {
  return (
    <section className="relative py-32 bg-gradient-to-b from-[#0B1120] via-[#162137] to-[#0B1120]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-hennyPenny text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 leading-tight">
              Yapay Zeka ile<br />Sınırsız Macera
            </h2>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-hennyPenny text-yellow-200 mb-2">{feature.title}</h3>
                    <p className="font-risque text-slate-300">{feature.description}</p>
                  </div>
                </div>
              ))}
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
  );
}; 
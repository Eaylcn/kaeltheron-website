import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const HeroSection = () => {
  return (
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
  );
}; 
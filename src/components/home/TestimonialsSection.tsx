import React, { useRef, useEffect } from 'react';
import Image from 'next/image';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  image: string;
}

const testimonials: Testimonial[] = [
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
];

export const TestimonialsSection = () => {
  const testimonialRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-testimonial-show');
          }
        });
      },
      { 
        threshold: 0.2,
        rootMargin: "-100px"
      }
    );

    testimonialRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
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
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              ref={(el) => {
                if (el) testimonialRefs.current[index] = el;
              }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-8 hover:bg-white/10 transition-all duration-300 opacity-0 translate-y-8"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-20 h-20 group">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full opacity-75 group-hover:opacity-100 blur-sm transition-all duration-300" />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-amber-400">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/40 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

        <div className="text-center mt-12">
          <button className="hover-glow group relative inline-flex items-center justify-center px-8 py-4 font-risque text-lg overflow-hidden rounded-xl border-2 border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 hover:scale-105">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/0 via-amber-500/30 to-amber-500/0 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <span className="relative text-amber-300 group-hover:text-amber-200 transition-all duration-300 group-hover:tracking-wider">Tüm Hikayeleri Gör</span>
          </button>
        </div>
      </div>
    </section>
  );
}; 
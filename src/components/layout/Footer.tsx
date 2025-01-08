'use client';

import React from 'react';
import Image from 'next/image';
import { FaDiscord, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative mt-20">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/80 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 py-12 relative">
        <div className="flex flex-col items-center space-y-8">
          <div className="relative w-32 h-12">
            <Image
              src="/dice-logo.svg"
              alt="Kael'Theron"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          <div className="flex space-x-8">
            <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors">
              <FaDiscord className="text-2xl" />
            </a>
            <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors">
              <FaTwitter className="text-2xl" />
            </a>
            <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors">
              <FaInstagram className="text-2xl" />
            </a>
            <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors">
              <FaYoutube className="text-2xl" />
            </a>
          </div>

          <div className="text-slate-400 text-sm">
            © 2024 Kael&apos;Theron. Tüm hakları saklıdır.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
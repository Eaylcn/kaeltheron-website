'use client';

import React from 'react';
import Image from 'next/image';
import { FaDiscord, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-slate-900 to-transparent dark:from-[#0B1120] py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center space-y-8">
          <div className="relative w-32 h-12">
            <Image
              src="/dice-logo.svg"
              alt="Kael'Theron"
              fill
              className="object-contain"
            />
          </div>
          
          <div className="flex space-x-8">
            <a href="#" className="text-slate-600 hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-300 transition-colors">
              <FaDiscord className="text-2xl" />
            </a>
            <a href="#" className="text-slate-600 hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-300 transition-colors">
              <FaTwitter className="text-2xl" />
            </a>
            <a href="#" className="text-slate-600 hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-300 transition-colors">
              <FaInstagram className="text-2xl" />
            </a>
            <a href="#" className="text-slate-600 hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-300 transition-colors">
              <FaYoutube className="text-2xl" />
            </a>
          </div>

          <div className="text-slate-600 dark:text-slate-400 text-sm">
            © 2024 Kael&apos;Theron. Tüm hakları saklıdır.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaDiscord, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative w-full bg-[#0B1120]">
      {/* Main Content */}
      <div className="w-full px-6 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <div className="relative w-40 h-14">
            <Image
              src="/logo3.png"
              alt="Kael'Theron"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            <Link href="/story" className="text-slate-400 hover:text-amber-500 transition-colors">
              Hikaye
            </Link>
            <Link href="/characters" className="text-slate-400 hover:text-amber-500 transition-colors">
              Karakterler
            </Link>
            <Link href="/map" className="text-slate-400 hover:text-amber-500 transition-colors">
              Harita
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6">
            <a 
              href="#" 
              className="text-slate-400 hover:text-amber-500 transition-all transform hover:scale-110"
              aria-label="Discord"
            >
              <FaDiscord className="text-2xl" />
            </a>
            <a 
              href="#" 
              className="text-slate-400 hover:text-amber-500 transition-all transform hover:scale-110"
              aria-label="Twitter"
            >
              <FaTwitter className="text-2xl" />
            </a>
            <a 
              href="#" 
              className="text-slate-400 hover:text-amber-500 transition-all transform hover:scale-110"
              aria-label="Instagram"
            >
              <FaInstagram className="text-2xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full border-t border-slate-800">
        <div className="px-6 py-4 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 Kael&apos;Theron. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
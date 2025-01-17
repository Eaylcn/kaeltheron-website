'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa';
import AuthModal from '../auth/AuthModal';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    setIsAuthModalOpen(false);
  };

  const handleProfileClick = () => {
    if (user) {
      router.replace('/profile');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'backdrop-blur-[2px] bg-gradient-to-b from-[#0B1120]/40 via-[#0B1120]/30 to-transparent pb-4' 
          : 'bg-gradient-to-b from-[#0B1120] to-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="relative w-48 h-12 block group">
                <div className="absolute inset-0 bg-transparent transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(252,211,77,1)]">
                  <Image
                    src="/logo3.png"
                    alt="Kael'Theron"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex space-x-8 -ml-24">
                <Link href="/story" className={`text-lg font-risque transition-colors ${
                  pathname === '/story' ? 'text-amber-300' : 'text-slate-200 hover:text-amber-300'
                }`}>
                  Hikaye
                </Link>
                <Link href="/characters" className={`text-lg font-risque transition-colors ${
                  pathname === '/characters' ? 'text-amber-300' : 'text-slate-200 hover:text-amber-300'
                }`}>
                  Karakterler
                </Link>
                <Link href="/map" className={`text-lg font-risque transition-colors ${
                  pathname === '/map' ? 'text-amber-300' : 'text-slate-200 hover:text-amber-300'
                }`}>
                  Harita
                </Link>
              </div>
            </div>

            {/* User Icon */}
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleProfileClick}
                  className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-slate-100/10 to-white/10 text-slate-100 hover:text-amber-300 hover:from-amber-500/20 hover:to-yellow-500/20 transition-all"
                >
                  <FaUser className="text-xl" />
                </button>
                <button className="md:hidden text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
};

export default Navbar; 
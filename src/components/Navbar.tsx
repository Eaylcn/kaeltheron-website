'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser } from 'react-icons/fa';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-secondary/10 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 relative">
        <div className="h-16 flex items-center">
          {/* Logo - Sol taraf */}
          <div className="absolute left-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              Kael&apos;theron
            </Link>
          </div>

          {/* Orta menü */}
          <div className="flex-1 flex justify-center">
            <div className="flex space-x-4">
              <Link
                href="/story"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/story')
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-primary/10'
                }`}
              >
                Hikaye
              </Link>
              <Link
                href="/characters"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/characters')
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-primary/10'
                }`}
              >
                Karakterler
              </Link>
              <Link
                href="/map"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/map')
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-primary/10'
                }`}
              >
                Harita
              </Link>
            </div>
          </div>

          {/* Hesap - Sağ taraf */}
          <div className="absolute right-4">
            <Link
              href="/account"
              className={`p-2 rounded-lg transition-colors ${
                isActive('/account')
                  ? 'bg-primary text-white'
                  : 'text-primary hover:bg-primary/10'
              }`}
            >
              <FaUser className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 
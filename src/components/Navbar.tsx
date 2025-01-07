'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaCog } from 'react-icons/fa';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-secondary/10 backdrop-blur-md fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary">
            Kael&apos;theron
          </Link>

          {/* Navigation Links - Centered */}
          <div className="flex-1 flex justify-center space-x-8">
            <Link
              href="/story"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/story' ? 'text-primary' : 'text-gray-400'
              }`}
            >
              Hikaye
            </Link>
            <Link
              href="/characters"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/characters' ? 'text-primary' : 'text-gray-400'
              }`}
            >
              Karakterler
            </Link>
            <Link
              href="/map"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/map' ? 'text-primary' : 'text-gray-400'
              }`}
            >
              Harita
            </Link>
          </div>

          {/* Settings Button */}
          <Link
            href="/settings"
            className={`p-2 rounded-lg transition-colors hover:bg-secondary/20 ${
              pathname === '/settings' ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <FaCog className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
} 
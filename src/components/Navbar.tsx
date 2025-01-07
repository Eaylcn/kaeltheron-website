'use client';

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { FaUserCircle } from 'react-icons/fa'

const Navbar = () => {
  const { user } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#0B1120] to-transparent">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-hennyPenny text-amber-400">
            Kael&apos;Theron
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/story" className="text-lg font-risque text-slate-200 hover:text-amber-300 transition-colors">
              Hikaye
            </Link>
            <Link href="/characters" className="text-lg font-risque text-slate-200 hover:text-amber-300 transition-colors">
              Karakterler
            </Link>
            <Link href="/map" className="text-lg font-risque text-slate-200 hover:text-amber-300 transition-colors">
              Harita
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-slate-300">{user.username}</span>
                <button id="auth-modal" className="text-amber-400 hover:text-amber-300">
                  <FaUserCircle className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <button id="auth-modal" className="text-amber-400 hover:text-amber-300">
                <FaUserCircle className="w-6 h-6" />
              </button>
            )}
            <button className="md:hidden text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 
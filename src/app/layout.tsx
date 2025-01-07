import React from 'react'
import type { Metadata } from 'next'
import { Risque } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'

const risque = Risque({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-risque',
})

export const metadata: Metadata = {
  title: 'Kael\'Theron',
  description: 'Yapay Zeka DM\'liğinde Efsanevi Bir Maceraya Hazır Olun',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${risque.variable} font-risque`}>
        <AuthProvider>
          <Navbar />
          <div className="min-h-screen">
            {children}
          </div>
          <Footer />
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  )
}

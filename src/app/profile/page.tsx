'use client';

import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaDragon, FaScroll, FaCog, FaPlus, FaPlay, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const tabs = [
  { id: 'characters', label: 'Karakterlerim', icon: <FaDragon /> },
  { id: 'adventures', label: 'Maceralarım', icon: <FaScroll /> },
  { id: 'settings', label: 'Ayarlar', icon: <FaCog /> }
];

export default function ProfilePage() {
  const { user, loading, logout, checkEmailVerification } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('characters');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Email verification durumunu periyodik olarak kontrol et
  useEffect(() => {
    if (user && !user.emailVerified) {
      const checkVerification = async () => {
        await checkEmailVerification();
      };

      // Sayfa yüklendiğinde kontrol et
      checkVerification();

      // Her 10 saniyede bir kontrol et
      const interval = setInterval(checkVerification, 10000);

      return () => clearInterval(interval);
    }
  }, [user, checkEmailVerification]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // Logout API'sini çağır
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Çıkış yapılırken bir hata oluştu');
      }

      // AuthContext'teki logout fonksiyonunu çağır
      logout();
      
      // Ana sayfaya yönlendir
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Çıkış yapılırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCharactersTab = () => (
    <div className="space-y-8">
      <div className="bg-[#162137] rounded-xl p-8">
        <div className="text-center">
          <FaUserCircle className="text-6xl text-slate-400 mx-auto mb-4" />
          <p className="text-slate-300 mb-6">Henüz bir karakterin bulunmuyor. Yeni bir karakter oluşturarak maceraya başlayabilirsin!</p>
          <button className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-risque rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all">
            <FaPlus />
            <span>Yeni Karakter Oluştur</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdventuresTab = () => (
    <div className="space-y-8">
      {/* Etkin Maceralar */}
      <div className="bg-[#162137] rounded-xl p-8">
        <h3 className="text-xl font-hennyPenny text-amber-400 mb-4">Etkin Maceralar</h3>
        <div className="text-center">
          <p className="text-slate-300 mb-6">Henüz etkin bir maceran bulunmuyor. Yeni bir maceraya başlayarak hikayeni yazmaya başlayabilirsin!</p>
          <button className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-risque rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all">
            <FaPlay />
            <span>Yeni Macera Başlat</span>
          </button>
        </div>
      </div>

      {/* Eski Maceralar */}
      <div className="bg-[#162137] rounded-xl p-8">
        <h3 className="text-xl font-hennyPenny text-amber-400 mb-4">Eski Maceralar</h3>
        <p className="text-slate-300 text-center">Henüz tamamlanmış bir maceran bulunmuyor.</p>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-8">
      {/* Hesap Bilgileri */}
      <div className="bg-[#162137] rounded-xl p-8">
        <h3 className="text-xl font-hennyPenny text-amber-400 mb-6">Hesap Bilgileri</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-slate-400 text-sm mb-1">Kullanıcı Adı</h4>
            <p className="text-slate-200 font-medium">{user?.username}</p>
          </div>
          <div>
            <h4 className="text-slate-400 text-sm mb-1">E-posta</h4>
            <div className="flex items-center space-x-2">
              <p className="text-slate-200 font-medium">{user?.email}</p>
              {user?.emailVerified ? (
                <span className="inline-flex items-center text-xs text-emerald-400">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Doğrulanmış</span>
                </span>
              ) : (
                <span className="inline-flex items-center text-xs text-amber-400">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Doğrulanmamış</span>
                </span>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-slate-400 text-sm mb-1">Katılma Tarihi</h4>
            <p className="text-slate-200 font-medium">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Çıkış Yap */}
      <div className="bg-[#162137] rounded-xl p-8">
        <h3 className="text-xl font-hennyPenny text-amber-400 mb-6">Oturumu Sonlandır</h3>
        <div className="space-y-4">
          <p className="text-slate-300">Hesabınızdan çıkış yapmak istediğinizden emin misiniz?</p>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-risque py-3 rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Çıkış Yapılıyor...</span>
              </div>
            ) : (
              <>
                <FaSignOutAlt className="text-xl" />
                <span>Çıkış Yap</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0B1120] pt-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-hennyPenny text-amber-400 mb-2">
            Hoşgeldin, {user.username}
          </h1>
          <p className="text-slate-400 font-risque">
            Macera seni bekliyor!
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
                    : 'bg-[#162137] text-slate-300 hover:text-amber-300'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-risque">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-20">
          {activeTab === 'characters' && renderCharactersTab()}
          {activeTab === 'adventures' && renderAdventuresTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>
    </main>
  );
} 
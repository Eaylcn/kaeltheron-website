'use client';

import React, { useState } from 'react';
import { FaUserCircle, FaDragon, FaScroll, FaCog, FaPlus, FaPlay, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const tabs = [
  { id: 'characters', label: 'Karakterlerim', icon: <FaDragon /> },
  { id: 'adventures', label: 'Maceralarım', icon: <FaScroll /> },
  { id: 'settings', label: 'Ayarlar', icon: <FaCog /> }
];

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('characters');
  const [isLoading, setIsLoading] = useState(false);

  // Kullanıcı giriş yapmamışsa ana sayfaya yönlendir
  React.useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // Clear the auth state
      localStorage.removeItem('token');
      // Redirect to home page after a small delay to show loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/');
      // Reset auth context
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
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
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">Kullanıcı Adı</label>
            <input
              type="text"
              value={user?.username || ''}
              disabled
              className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">E-posta</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200"
            />
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
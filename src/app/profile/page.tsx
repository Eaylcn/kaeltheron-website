'use client';

import React, { useState } from 'react';
import { FaUserCircle, FaDragon, FaScroll, FaCog, FaPlus, FaPlay } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const tabs = [
  { id: 'characters', label: 'Karakterlerim', icon: <FaDragon /> },
  { id: 'adventures', label: 'Maceralarım', icon: <FaScroll /> },
  { id: 'settings', label: 'Ayarlar', icon: <FaCog /> }
];

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('characters');

  // Kullanıcı giriş yapmamışsa ana sayfaya yönlendir
  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/');
      }
    }
  }, [user, loading, router]);

  // Loading durumunda veya kullanıcı yoksa
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Router will handle the redirect
  }

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
      <div className="bg-[#162137] rounded-xl p-6">
        <h3 className="text-xl font-hennyPenny text-amber-400 mb-6">Hesap Bilgileri</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">Kullanıcı Adı</label>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-400">{user.username}</p>
            </div>
          </div>
          <div>
            <label className="block text-slate-300 mb-2">E-posta</label>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B1120] py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row-reverse gap-8">
          {/* Sidebar - now on the right */}
          <div className="w-full md:w-64 md:flex-shrink-0">
            <div className="bg-[#162137] rounded-xl p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <FaUserCircle className="w-12 h-12 text-amber-400" />
                <div>
                  <h2 className="text-lg font-medium text-slate-200">{user.username}</h2>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-300'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content - centered */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full max-w-3xl">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-hennyPenny text-amber-400 mb-2">
                  Hoşgeldin, {user.username}
                </h1>
                <p className="text-slate-400 font-risque">
                  Macera seni bekliyor!
                </p>
              </div>

              {/* Tab Content */}
              <div className="pb-20">
                {activeTab === 'characters' && renderCharactersTab()}
                {activeTab === 'adventures' && renderAdventuresTab()}
                {activeTab === 'settings' && renderSettingsTab()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
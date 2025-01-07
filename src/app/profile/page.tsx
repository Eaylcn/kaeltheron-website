'use client';

import React, { useState } from 'react';
import { FaUserCircle, FaDragon, FaScroll, FaCog, FaPlus, FaPlay, FaEye, FaEyeSlash } from 'react-icons/fa';
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Kullanıcı giriş yapmamışsa ana sayfaya yönlendir
  React.useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  const renderEmailChangeModal = () => {
    if (!isEmailModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-[#162137] rounded-xl w-full max-w-md p-6 relative">
          <h3 className="text-xl font-hennyPenny text-amber-400 mb-6">E-posta Adresini Değiştir</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-2">Mevcut E-posta</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Yeni E-posta</label>
              <input
                type="email"
                className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Şifreniz</label>
              <input
                type="password"
                className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-risque py-2 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all"
              >
                Güncelle
              </button>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="flex-1 bg-slate-700 text-white font-risque py-2 rounded-lg hover:bg-slate-600 transition-all"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
            <button 
              onClick={() => setIsEmailModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 text-sm mt-2"
            >
              E-posta Adresini Değiştir
            </button>
          </div>
        </div>
      </div>

      {/* Şifre Değiştirme */}
      <div className="bg-[#162137] rounded-xl p-8">
        <h3 className="text-xl font-hennyPenny text-amber-400 mb-6">Şifre Değiştir</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">Mevcut Şifre</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 pr-12 text-slate-200 focus:outline-none focus:border-amber-500/50"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Yeni Şifre</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 pr-12 text-slate-200 focus:outline-none focus:border-amber-500/50"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Yeni Şifre Tekrar</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 pr-12 text-slate-200 focus:outline-none focus:border-amber-500/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-risque py-2 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all"
          >
            Şifreyi Güncelle
          </button>
        </form>
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
        {renderEmailChangeModal()}
      </div>
    </main>
  );
} 
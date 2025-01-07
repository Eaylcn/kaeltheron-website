'use client';

import { useState } from 'react';
import { FaSignOutAlt, FaUser, FaCog } from 'react-icons/fa';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Hesabım</h1>
        
        <div className="grid gap-6 md:grid-cols-[240px,1fr]">
          {/* Sol menü */}
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-primary text-white' : 'text-primary hover:bg-primary/10'
              }`}
            >
              <FaUser />
              <span>Profil</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'settings' ? 'bg-primary text-white' : 'text-primary hover:bg-primary/10'
              }`}
            >
              <FaCog />
              <span>Ayarlar</span>
            </button>
          </div>

          {/* Sağ içerik */}
          <div className="bg-secondary/10 rounded-lg p-6">
            {activeTab === 'profile' ? (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Profil Bilgileri</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">Kullanıcı Adı</label>
                    <input
                      type="text"
                      value="eaylcn"
                      disabled
                      className="w-full px-4 py-2 rounded-lg bg-secondary/5 border border-secondary/20 text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">E-posta</label>
                    <input
                      type="email"
                      value="eaylcn@gmail.com"
                      disabled
                      className="w-full px-4 py-2 rounded-lg bg-secondary/5 border border-secondary/20 text-primary"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Ayarlar</h2>
                <div className="space-y-4">
                  {/* Ayarlar buraya gelecek */}
                  <div className="pt-4 border-t border-secondary/20">
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/auth/logout', {
                            method: 'POST',
                          });
                          if (response.ok) {
                            window.location.href = '/';
                          } else {
                            console.error('Çıkış yapılırken bir hata oluştu');
                          }
                        } catch (error) {
                          console.error('Çıkış yapılırken bir hata oluştu:', error);
                        }
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <FaSignOutAlt />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 
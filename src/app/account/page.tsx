'use client';

import { FaSignOutAlt, FaUser, FaCog } from 'react-icons/fa';

export default function AccountPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Hesabım</h1>
        
        <div className="grid gap-6 md:grid-cols-[240px,1fr]">
          {/* Sol menü */}
          <div className="space-y-2">
            <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white">
              <FaUser />
              <span>Profil</span>
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-primary hover:bg-primary/10">
              <FaCog />
              <span>Ayarlar</span>
            </button>
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
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 hover:bg-red-500/10"
            >
              <FaSignOutAlt />
              <span>Çıkış Yap</span>
            </button>
          </div>

          {/* Sağ içerik */}
          <div className="bg-secondary/10 rounded-lg p-6">
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
          </div>
        </div>
      </div>
    </main>
  );
} 
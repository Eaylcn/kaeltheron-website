'use client';

import { FaSignOutAlt } from 'react-icons/fa';

export default function SettingsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Ayarlar</h1>
        
        <div className="bg-secondary/10 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Hesap Ayarları</h2>
          {/* Diğer ayarlar buraya gelecek */}
        </div>

        <div className="bg-secondary/10 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Oturum</h2>
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
    </main>
  );
} 
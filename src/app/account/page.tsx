'use client';

import { FaSignOutAlt } from 'react-icons/fa';

export default function AccountPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Hesabım</h1>
        
        <div className="bg-secondary/10 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Ayarlar</h2>
          <div className="space-y-4">
            {/* Ayarlar buraya gelecek */}
            <div className="border-t border-secondary/20 pt-4 mt-4">
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
        </div>

        <div className="bg-secondary/10 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Profil Bilgileri</h2>
          {/* Profil bilgileri buraya gelecek */}
        </div>
      </div>
    </main>
  );
} 
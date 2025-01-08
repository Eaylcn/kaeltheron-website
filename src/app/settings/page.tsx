'use client';

import { useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface FirebaseError {
  code?: string;
  message: string;
}

function SettingsContent() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-primary">Ayarlar</h1>
          <p className="text-lg">Lütfen önce giriş yapın.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Ayarlar</h1>
        
        <div className="bg-secondary/10 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Hesap Bilgileri</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
              <p className="text-lg">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-posta</label>
              <p className="text-lg">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/10 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Oturum</h2>
          <button
            onClick={async () => {
              try {
                await logout();
                window.location.href = '/';
              } catch (error) {
                console.error('Çıkış yapılırken bir hata oluştu:', error);
                toast.error('Çıkış yapılırken bir hata oluştu');
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

export default function SettingsPage() {
  return (
    <SettingsContent />
  );
} 
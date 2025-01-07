'use client';

import { useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUserEmail, updateUserPassword, logout } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    try {
      setLoading(true);
      await updateUserEmail(newEmail);
      toast.success('Email başarıyla güncellendi');
      setNewEmail('');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error('Bu işlem için yeniden giriş yapmanız gerekiyor');
      } else {
        toast.error('Email güncellenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;
    
    if (newPassword !== confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor');
      return;
    }

    try {
      setLoading(true);
      await updateUserPassword(currentPassword, newPassword);
      toast.success('Şifre başarıyla güncellendi');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        toast.error('Mevcut şifre yanlış');
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error('Bu işlem için yeniden giriş yapmanız gerekiyor');
      } else {
        toast.error('Şifre güncellenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Ayarlar</h1>
        
        <div className="bg-secondary/10 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Email Güncelle</h2>
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium mb-1">
                Yeni Email
              </label>
              <input
                type="email"
                id="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="yeni@email.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Email Güncelle
            </button>
          </form>
        </div>

        <div className="bg-secondary/10 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Şifre Güncelle</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                Mevcut Şifre
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                Yeni Şifre
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Yeni Şifre (Tekrar)
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Şifre Güncelle
            </button>
          </form>
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
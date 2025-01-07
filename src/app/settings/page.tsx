'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

interface FirebaseError {
  code?: string;
  message: string;
}

export default function SettingsPage() {
  const { user, updateUserEmail, updateUserPassword, logout, sendVerificationEmail, reauthenticateUser, verifyAndUpdateEmail } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleEmailVerification = useCallback(async (oobCode: string) => {
    try {
      setLoading(true);
      await verifyAndUpdateEmail(oobCode);
      toast.success('Email başarıyla güncellendi ve doğrulandı');
    } catch {
      toast.error('Email doğrulama işlemi başarısız oldu');
    } finally {
      setLoading(false);
    }
  }, [verifyAndUpdateEmail]);

  useEffect(() => {
    // URL'den email doğrulama kodunu kontrol et
    const oobCode = searchParams.get('oobCode');
    if (oobCode && user?.pendingEmail) {
      handleEmailVerification(oobCode);
    }
  }, [searchParams, user, handleEmailVerification]);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !user || !emailPassword) return;

    try {
      setLoading(true);
      await reauthenticateUser(emailPassword);
      await updateUserEmail(newEmail);
      toast.success('Doğrulama emaili gönderildi. Lütfen yeni emailinizi doğrulayın.');
      setNewEmail('');
      setEmailPassword('');
    } catch (error: unknown) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/wrong-password') {
        toast.error('Girdiğiniz şifre yanlış');
      } else if (firebaseError.code === 'auth/requires-recent-login') {
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
    if (!currentPassword || !newPassword || !confirmPassword || !user) return;
    
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
    } catch (error: unknown) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/wrong-password') {
        toast.error('Mevcut şifre yanlış');
      } else if (firebaseError.code === 'auth/requires-recent-login') {
        toast.error('Bu işlem için yeniden giriş yapmanız gerekiyor');
      } else {
        toast.error('Şifre güncellenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-2xl font-semibold mb-4 text-primary">Email Güncelle</h2>
          {user.pendingEmail && (
            <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
              <p>
                <strong>{user.pendingEmail}</strong> adresine doğrulama emaili gönderildi.
                Lütfen emailinizi kontrol edin ve doğrulama linkine tıklayın.
              </p>
            </div>
          )}
          {!user.emailVerified && !user.pendingEmail && (
            <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
              <p>Email adresiniz henüz doğrulanmamış. 
                <button 
                  onClick={async () => {
                    try {
                      await sendVerificationEmail();
                      toast.success('Doğrulama emaili gönderildi');
                    } catch {
                      toast.error('Doğrulama emaili gönderilemedi');
                    }
                  }}
                  className="ml-2 underline hover:text-yellow-900"
                >
                  Doğrulama maili gönder
                </button>
              </p>
            </div>
          )}
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
            <div>
              <label htmlFor="emailPassword" className="block text-sm font-medium mb-1">
                Mevcut Şifreniz
              </label>
              <input
                type="password"
                id="emailPassword"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="İşlemi onaylamak için şifrenizi girin"
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
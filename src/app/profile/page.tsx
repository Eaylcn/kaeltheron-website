'use client';

import React, { useState } from 'react';
import { FaUserCircle, FaDragon, FaScroll, FaCog, FaPlus, FaPlay, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const tabs = [
  { id: 'characters', label: 'Karakterlerim', icon: <FaDragon /> },
  { id: 'adventures', label: 'Maceralarım', icon: <FaScroll /> },
  { id: 'settings', label: 'Ayarlar', icon: <FaCog /> }
];

export default function ProfilePage() {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('characters');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  
  // Ayrı hata ve yükleme durumları
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Form states
  const [emailChangePassword, setEmailChangePassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Kullanıcı giriş yapmamışsa ana sayfaya yönlendir
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Loading durumunda veya kullanıcı yoksa
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  // Email değiştirme fonksiyonu
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');
    setEmailLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setEmailError('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
      setEmailLoading(false);
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !user) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      // Kullanıcıyı yeniden doğrula
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        emailChangePassword
      );

      await reauthenticateWithCredential(currentUser, credential);

      // Firestore'da email güncelle
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        email: newEmail.toLowerCase()
      });

      // Firebase Auth'da email güncelle
      await updateEmail(currentUser, newEmail);

      // Yeni token al
      const newToken = await currentUser.getIdToken(true);
      localStorage.setItem('token', newToken);

      // Context'teki user bilgisini güncelle
      setUser({
        ...user,
        email: newEmail
      });

      setEmailSuccess('E-posta adresiniz başarıyla güncellendi');
      handleCloseEmailModal();
    } catch (error) {
      console.error('Email değiştirme hatası:', error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/requires-recent-login':
            setEmailError('Güvenlik nedeniyle yeniden giriş yapmanız gerekiyor');
            break;
          case 'auth/invalid-email':
            setEmailError('Geçersiz e-posta adresi');
            break;
          case 'auth/email-already-in-use':
            setEmailError('Bu e-posta adresi zaten kullanımda');
            break;
          case 'auth/wrong-password':
            setEmailError('Hatalı şifre');
            break;
          default:
            setEmailError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin');
        }
      } else {
        setEmailError('Beklenmeyen bir hata oluştu');
      }
    } finally {
      setEmailLoading(false);
    }
  };

  // Şifre değiştirme fonksiyonu
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setPasswordError('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Yeni şifreler eşleşmiyor');
      setPasswordLoading(false);
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !user) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      // Kullanıcıyı yeniden doğrula
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        currentPassword
      );

      await reauthenticateWithCredential(currentUser, credential);

      // Şifreyi güncelle
      await updatePassword(currentUser, newPassword);

      // Yeni token al
      const newToken = await currentUser.getIdToken(true);
      localStorage.setItem('token', newToken);

      setPasswordSuccess('Şifreniz başarıyla güncellendi');

      // Şifre değişince oturumu kapat
      setTimeout(async () => {
        try {
          await auth.signOut();
          localStorage.removeItem('token');
          router.push('/');
        } catch (error) {
          console.error('Logout error:', error);
        }
      }, 2000);
    } catch (error) {
      console.error('Şifre değiştirme hatası:', error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/requires-recent-login':
            setPasswordError('Güvenlik nedeniyle yeniden giriş yapmanız gerekiyor');
            break;
          case 'auth/weak-password':
            setPasswordError('Şifre çok zayıf. En az 6 karakter kullanın');
            break;
          case 'auth/wrong-password':
            setPasswordError('Mevcut şifreniz hatalı');
            break;
          default:
            setPasswordError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin');
        }
      } else {
        setPasswordError('Beklenmeyen bir hata oluştu');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const renderEmailChangeModal = () => {
    if (!isEmailModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-[#162137] rounded-xl w-full max-w-md p-6 relative">
          <h3 className="text-xl font-hennyPenny text-amber-400 mb-6">E-posta Adresini Değiştir</h3>
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-2">Mevcut E-posta</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Yeni E-posta</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-amber-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Şifreniz</label>
              <input
                type="password"
                value={emailChangePassword}
                onChange={(e) => setEmailChangePassword(e.target.value)}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-amber-500/50"
                required
              />
            </div>
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            {emailSuccess && <p className="text-green-500 text-sm">{emailSuccess}</p>}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={emailLoading}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-risque py-2 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50"
              >
                {emailLoading ? 'Güncelleniyor...' : 'Güncelle'}
              </button>
              <button
                type="button"
                onClick={handleCloseEmailModal}
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
              onClick={() => {
                handleCloseEmailModal();
                setIsEmailModalOpen(true);
              }}
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
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">Mevcut Şifre</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 pr-12 text-slate-200 focus:outline-none focus:border-amber-500/50"
                required
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 pr-12 text-slate-200 focus:outline-none focus:border-amber-500/50"
                required
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 pr-12 text-slate-200 focus:outline-none focus:border-amber-500/50"
                required
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
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          {passwordSuccess && <p className="text-green-500 text-sm">{passwordSuccess}</p>}
          <button
            type="submit"
            disabled={passwordLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-risque py-2 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50"
          >
            {passwordLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </button>
        </form>
      </div>

      {/* Çıkış Yap */}
      <div className="bg-[#162137] rounded-xl p-8">
        <h3 className="text-xl font-hennyPenny text-amber-400 mb-6">Oturumu Sonlandır</h3>
        <div className="space-y-4">
          <p className="text-slate-300">Hesabınızdan çıkış yapmak istediğinizden emin misiniz?</p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/');
              window.location.reload();
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-risque py-3 rounded-lg transition-all flex items-center justify-center space-x-2"
          >
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Modal kapatıldığında tüm form alanlarını temizle
  const handleCloseEmailModal = () => {
    setEmailChangePassword('');
    setNewEmail('');
    setEmailError('');
    setEmailSuccess('');
    setIsEmailModalOpen(false);
  };

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
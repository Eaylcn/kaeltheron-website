'use client';

import React, { useState } from 'react';
import { FaUserCircle, FaDragon, FaScroll, FaCog, FaPlus, FaPlay, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/firebase';

const tabs = [
  { id: 'characters', label: 'Karakterlerim', icon: <FaDragon /> },
  { id: 'adventures', label: 'Maceralarım', icon: <FaScroll /> },
  { id: 'settings', label: 'Ayarlar', icon: <FaCog /> }
];

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('characters');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Email değiştirme fonksiyonu
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!user || !auth.currentUser) throw new Error('Kullanıcı oturumu bulunamadı');
      
      // Kullanıcıyı yeniden doğrula
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Email güncelle
      await updateEmail(auth.currentUser, newEmail);
      
      // Context'teki user bilgisini güncelle
      setUser({ ...user, email: newEmail });
      
      setSuccess('E-posta adresiniz başarıyla güncellendi');
      setIsEmailModalOpen(false);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/requires-recent-login':
            setError('Güvenlik nedeniyle yeniden giriş yapmanız gerekiyor');
            break;
          case 'auth/invalid-email':
            setError('Geçersiz e-posta adresi');
            break;
          case 'auth/email-already-in-use':
            setError('Bu e-posta adresi zaten kullanımda');
            break;
          case 'auth/wrong-password':
            setError('Hatalı şifre');
            break;
          default:
            setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin');
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Beklenmeyen bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  // Şifre değiştirme fonksiyonu
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    try {
      if (!user || !auth.currentUser) throw new Error('Kullanıcı oturumu bulunamadı');
      
      // Kullanıcıyı yeniden doğrula
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Şifreyi güncelle
      await updatePassword(auth.currentUser, newPassword);
      
      setSuccess('Şifreniz başarıyla güncellendi');
      
      // Şifre değişince oturumu kapat
      localStorage.removeItem('token');
      router.push('/');
      window.location.reload();
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/requires-recent-login':
            setError('Güvenlik nedeniyle yeniden giriş yapmanız gerekiyor');
            break;
          case 'auth/weak-password':
            setError('Şifre çok zayıf. En az 6 karakter kullanın');
            break;
          case 'auth/wrong-password':
            setError('Mevcut şifreniz hatalı');
            break;
          default:
            setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin');
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Beklenmeyen bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

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
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-amber-500/50"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-risque py-2 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Güncelleniyor...' : 'Güncelle'}
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
              onClick={() => {
                setError('');
                setSuccess('');
                setCurrentPassword('');
                setNewEmail('');
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-risque py-2 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
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
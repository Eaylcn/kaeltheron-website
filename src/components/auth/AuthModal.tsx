'use client';

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const { login } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // API'ye istek at
      const response = await fetch('/api/auth/' + (isLoginView ? 'login' : 'register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Bir hata oluştu');
      }

      if (!isLoginView) {
        // Kayıt başarılı, kullanıcıya e-posta doğrulama mesajını göster
        alert(data.message || 'Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.');
      }
      
      // Login the user with complete user data
      login(data);
      
      // Set token
      localStorage.setItem('token', 'dummy-token');
      
      // Close modal and notify parent
      onLogin();
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
      alert(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-[#162137] rounded-xl w-full max-w-md p-6">
          <Dialog.Title className="text-2xl font-hennyPenny text-amber-400 mb-6">
            {isLoginView ? 'Giriş Yap' : 'Kayıt Ol'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-2">Kullanıcı Adı</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-amber-500/50"
                disabled={isLoading}
                required
              />
            </div>

            {!isLoginView && (
              <div>
                <label className="block text-slate-300 mb-2">E-posta</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-amber-500/50"
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <label className="block text-slate-300 mb-2">Şifre</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 pr-12 text-slate-200 focus:outline-none focus:border-amber-500/50"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-risque py-3 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isLoginView ? 'Giriş Yapılıyor...' : 'Kayıt Olunuyor...'}</span>
                </div>
              ) : (
                <span>{isLoginView ? 'Giriş Yap' : 'Kayıt Ol'}</span>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLoginView(!isLoginView)}
                className="text-amber-400 hover:text-amber-300 text-sm"
                disabled={isLoading}
              >
                {isLoginView ? 'Hesabın yok mu? Kayıt ol' : 'Zaten hesabın var mı? Giriş yap'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AuthModal; 
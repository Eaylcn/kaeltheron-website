'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onCloseAction: () => Promise<void>;
  onLoginAction: () => Promise<void>;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function AuthModal({ isOpen, onCloseAction, onLoginAction }: AuthModalProps) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Login işlemi
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
          login(data.username, data.email, data.uid);
          await onLoginAction();
        } else {
          setError(data.message || 'Giriş yapılamadı');
        }
      } else {
        // Kayıt işlemi
        if (formData.password !== formData.confirmPassword) {
          setError('Şifreler eşleşmiyor');
          return;
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            isLogin: false
          }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
          login(data.username, data.email, data.uid);
          await onLoginAction();
        } else {
          setError(data.message || 'Kayıt yapılamadı');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#162137] rounded-xl w-full max-w-md p-6 relative">
        <h2 className="text-2xl font-hennyPenny text-amber-400 mb-6">
          {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isLogin ? (
            <>
              <div>
                <label className="block text-slate-300 mb-2">Kullanıcı Adı</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Şifre</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-slate-300 mb-2">Kullanıcı Adı</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-amber-500/50"
                  required={!isLogin}
                />
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">E-posta</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Şifre</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Şifre Tekrar</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-amber-500/50"
                  required={!isLogin}
                />
              </div>
            </>
          )}
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-risque py-2 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50"
          >
            {loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
          </button>
        </form>
        
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-amber-400 hover:text-amber-300 text-sm mt-4"
        >
          {isLogin ? 'Hesabın yok mu? Kayıt ol' : 'Zaten hesabın var mı? Giriş yap'}
        </button>
        
        <button
          onClick={() => onCloseAction()}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
} 
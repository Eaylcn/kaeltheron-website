'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
  onLogin?: () => void;
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login', onLogin }: AuthModalProps) {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Reset all states when modal closes
  const handleClose = () => {
    setError(null);
    setLoading(false);
    setShowLoginPassword(false);
    setShowRegisterPassword(false);
    setShowRegisterConfirmPassword(false);
    setLoginData({ username: '', password: '' });
    setRegisterData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setActiveTab(defaultTab);
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { username, password } = loginData;
      await login(username, password);
      if (onLogin) onLogin();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Giriş yapılırken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { username, email, password, confirmPassword } = registerData;

      if (password !== confirmPassword) {
        throw new Error('Şifreler eşleşmiyor');
      }

      if (password.length < 6) {
        throw new Error('Şifre en az 6 karakter olmalıdır');
      }

      await register(username, email, password);
      // Switch to login tab after successful registration
      setActiveTab('login');
      setRegisterData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Kayıt olurken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogOverlay className="bg-black/40 backdrop-blur-sm fixed inset-0" />
      <DialogContent className="fixed sm:max-w-[400px] w-[95%] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#0B1120] border border-[#1a2236] shadow-xl rounded-lg overflow-hidden">
        <DialogHeader className="pt-6 pb-2">
          <DialogTitle className="text-center text-xl font-medium text-amber-500">
            {activeTab === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          setError(null);
        }} className="w-full">
          <div className="px-6">
            <TabsList className="h-10 items-center justify-center grid w-full grid-cols-2 bg-[#0f1624] p-1 rounded">
              <TabsTrigger 
                value="login" 
                className="inline-flex items-center justify-center whitespace-nowrap px-3 text-sm data-[state=active]:bg-[#162137] data-[state=active]:text-amber-500 text-slate-400 font-medium transition-all rounded h-full"
              >
                Giriş Yap
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="inline-flex items-center justify-center whitespace-nowrap px-3 text-sm data-[state=active]:bg-[#162137] data-[state=active]:text-amber-500 text-slate-400 font-medium transition-all rounded h-full"
              >
                Kayıt Ol
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="login" className="px-6 py-6 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 transition-opacity duration-200">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-username" className="text-slate-300 text-sm">Kullanıcı Adı</Label>
                <Input
                  id="login-username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  required
                  className="bg-[#0f1624] border-[#1a2236] text-slate-300 focus:ring-0 focus:border-amber-500 h-12 rounded"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password" className="text-slate-300 text-sm">Şifre</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="bg-[#0f1624] border-[#1a2236] text-slate-300 focus:ring-0 focus:border-amber-500 h-12 rounded"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent text-slate-400 hover:text-slate-200 transition-colors"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium h-12 rounded transition-all mt-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Giriş Yapılıyor...
                  </>
                ) : (
                  'Giriş Yap'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="px-6 py-6 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 transition-opacity duration-200">
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="register-username" className="text-slate-300 font-medium">Kullanıcı Adı</Label>
                <Input
                  id="register-username"
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  required
                  className="bg-[#0f1624] border-[#1a2236] text-slate-300 focus:ring-amber-500 focus:border-amber-500 h-12 rounded"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-slate-300 font-medium">E-posta</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                  className="bg-[#0f1624] border-[#1a2236] text-slate-300 focus:ring-amber-500 focus:border-amber-500 h-12 rounded"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-slate-300 font-medium">Şifre</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showRegisterPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    className="bg-[#0f1624] border-[#1a2236] text-slate-300 focus:ring-amber-500 focus:border-amber-500 h-12 rounded"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent text-slate-400 hover:text-slate-200 transition-colors"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    {showRegisterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password" className="text-slate-300 font-medium">Şifre Tekrar</Label>
                <div className="relative">
                  <Input
                    id="register-confirm-password"
                    type={showRegisterConfirmPassword ? "text" : "password"}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                    className="bg-[#0f1624] border-[#1a2236] text-slate-300 focus:ring-amber-500 focus:border-amber-500 h-12 rounded"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent text-slate-400 hover:text-slate-200 transition-colors"
                    onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                  >
                    {showRegisterConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium h-12 rounded transition-all" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kayıt Yapılıyor...
                  </>
                ) : (
                  'Kayıt Ol'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 
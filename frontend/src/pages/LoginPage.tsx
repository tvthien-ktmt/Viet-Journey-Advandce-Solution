import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useT } from '@/store/langStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/store/authStore';
import { authApi } from '@/api/auth';

export default function LoginPage() {
  const t = useT();
  const navigate = useNavigate();
  const setAuth = useAuth(s => s.setAuth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password) as any;
      setAuth(res.user, res.accessToken || res.token, res.refreshToken);
      toast.success(t('login.success'));
      
      const redirectPath = location.state?.from?.pathname 
        ? location.state.from.pathname + (location.state.from.search || '')
        : ((res.user.roles?.includes('ADMIN') || res.user.role === 'ADMIN') ? '/admin' : '/profile');
        
      navigate(redirectPath, { replace: true });
    } catch (e) {
      const error = e as any;
      toast.error(error.response?.data?.message || t('login.failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-vna-blue overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop" 
          alt="Vietnam Airlines" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vna-blue/90 via-vna-blue/40 to-transparent" />
        
        <div className="absolute bottom-20 left-16 right-16 text-white">
          <img src="https://www.vietnamairlines.com/~/media/Images/VNANew/Home/Logo/logo_vna_menu.png" alt="Logo" className="h-12 mb-8 filter brightness-0 invert" />
          <h2 className="text-4xl font-bold mb-4">{t('hero.title')}</h2>
          <p className="text-xl text-slate-200">{t('hero.subtitle')}</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          
          <Button variant="ghost" className="flex items-center gap-2 mb-8 text-slate-500 hover:text-vna-blue rounded-lg transition-colors duration-200" onClick={() => navigate('/')}>
            <ChevronLeft className="w-4 h-4 mr-2" /> {t('error.backToHome')}
          </Button>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-vna-blue mb-3">{t('login.title')}</h1>
            <p className="text-slate-600">{t('login.subtitle')}</p>
          </div>

          <Card className="shadow-lg border-0 rounded-xl">
            <CardContent className="p-8 rounded-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('login.email')}</Label>
                  <Input 
                    id="email" 
                    placeholder={t('login.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">{t('login.password')}</Label>
                    <Link to="/forgot-password" className="text-sm font-medium text-vna-blue hover:underline transition-colors duration-200">
                      {t('login.forgot')}
                    </Link>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('login.passwordPlaceholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pr-10 rounded-xl"
                      required
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full bg-vna-gold hover:bg-vna-gold/90 text-white text-base rounded-lg transition-colors duration-200" disabled={isLoading}>
                  {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : t('login.submit')}
                </Button>

              </form>
            </CardContent>
          </Card>

          <p className="text-center mt-8 text-slate-600">
            <Link to="/register" className="font-semibold text-vna-blue hover:underline transition-colors duration-200">
              {t('login.register')}
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

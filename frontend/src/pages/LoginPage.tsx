import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useT } from '@/store/langStore';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Card, CardContent } from '@/components/ui';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/store/authStore';
import { authApi } from '@/api/auth';

export default function LoginPage() {
  const _t = useT();
  const _navigate = useNavigate();
  const setAuth = useAuth(s => s.setAuth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const _location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      let res;
      if (loginMethod === 'password') {
        if (!password) { setIsLoading(false); return; }
        res = await authApi.login(email, password);
      } else {
        if (!otp) { setIsLoading(false); return; }
        res = await authApi.verifyLoginOtp(email, otp);
      }
      
      setAuth(res.user, res.token, '');
      toast.success(_t('login.success'));
      
      const redirectPath = _location.state?.from?.pathname 
        ? _location.state.from.pathname + (_location.state.from.search || '')
        : ((res.user.roles?.includes('ADMIN') || res.user.role === 'ADMIN') ? '/admin' : '/profile');
        
      _navigate(redirectPath, { replace: true });
    } catch (_e: any) {
      const error = _e as Error & { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || _t('login.failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast.error('Vui lòng nhập email để nhận mã OTP');
      return;
    }
    setIsLoading(true);
    try {
      await authApi.sendLoginOtp(email);
      setOtpSent(true);
      toast.success('Đã gửi mã OTP, vui lòng kiểm tra email của bạn');
    } catch (_e: any) {
      toast.error('Có lỗi xảy ra khi gửi mã OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await authApi.mockGoogleLogin('mockuser@gmail.com', 'Mock Google User');
      setAuth(res.user, res.token, '');
      toast.success('Đăng nhập Google thành công (Mock)');
      _navigate('/profile', { replace: true });
    } catch (_e: any) {
      toast.error('Đăng nhập Google thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-vna-blue overflow-hidden">
        <img 
          src="/images/vna_login_bg.png" 
          alt="Vietnam Airlines" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vna-blue/90 via-vna-blue/40 to-transparent" />
        
        <div className="absolute bottom-20 left-16 right-16 text-white">
          <img src="https://www.vietnamairlines.com/~/media/Images/VNANew/Home/Logo/logo_vna_menu.png" alt="Logo" className="h-12 mb-8 filter brightness-0 invert" />
          <h2 className="text-4xl font-bold mb-4">{_t('hero.title')}</h2>
          <p className="text-xl text-slate-200">{_t('hero.subtitle')}</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          
          <Button variant="ghost" className="flex items-center gap-2 mb-8 text-slate-500 hover:text-vna-blue rounded-lg transition-colors duration-200" onClick={() => _navigate('/')}>
            <ChevronLeft className="w-4 h-4 mr-2" /> {_t('error.backToHome')}
          </Button>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-vna-blue mb-3">{_t('login.title')}</h1>
            <p className="text-slate-600">{_t('login.subtitle')}</p>
          </div>

          <Card className="shadow-lg border-0 rounded-xl">
            <CardContent className="p-8 rounded-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="flex gap-4 mb-4">
                  <Button type="button" variant={loginMethod === 'password' ? 'default' : 'outline'} className={`flex-1 ${loginMethod === 'password' ? 'bg-vna-blue hover:bg-vna-blue/90 text-white' : ''}`} onClick={() => setLoginMethod('password')}>Mật khẩu</Button>
                  <Button type="button" variant={loginMethod === 'otp' ? 'default' : 'outline'} className={`flex-1 ${loginMethod === 'otp' ? 'bg-vna-blue hover:bg-vna-blue/90 text-white' : ''}`} onClick={() => setLoginMethod('otp')}>Mã OTP</Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{_t('login.email')}</Label>
                  <Input 
                    id="email" 
                    placeholder={_t('login.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                {loginMethod === 'password' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">{_t('login.password')}</Label>
                      <Link to="/forgot-password" className="text-sm font-medium text-vna-blue hover:underline transition-colors duration-200">
                        {_t('login.forgot')}
                      </Link>
                    </div>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? 'text' : 'password'}
                        placeholder={_t('login.passwordPlaceholder')}
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
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="otp">Mã OTP</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="otp" 
                        placeholder="Nhập mã OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="h-12 rounded-xl"
                        required={loginMethod === 'otp'}
                        disabled={!otpSent}
                      />
                      <Button type="button" onClick={handleSendOtp} disabled={isLoading || !email} className="h-12 whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700">
                        {otpSent ? 'Gửi lại' : 'Nhận mã'}
                      </Button>
                    </div>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full bg-vna-gold hover:bg-vna-gold/90 text-white text-base rounded-lg transition-colors duration-200" disabled={isLoading}>
                  {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : _t('login.submit')}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Hoặc tiếp tục với</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button type="button" variant="outline" className="h-12 w-full" onClick={handleMockGoogleLogin}>
                    Google
                  </Button>
                  <Button type="button" variant="outline" className="h-12 w-full" onClick={() => toast.success('Mock Facebook login')}>
                    Facebook
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>

          <p className="text-center mt-8 text-slate-600">
            <Link to="/register" className="font-semibold text-vna-blue hover:underline transition-colors duration-200">
              {_t('login.register')}
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}




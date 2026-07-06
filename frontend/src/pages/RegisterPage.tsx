import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useT } from '@/store/langStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';

export default function RegisterPage() {
  const t = useT();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.register({
        fullName: `${lastName} ${firstName}`.trim(),
        email,
        phone,
        password
      });
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-vna-gold overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop" 
          alt="Vietnam Airlines Lotus" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vna-gold/90 via-vna-gold/40 to-transparent" />
        
        <div className="absolute bottom-20 left-16 right-16 text-white">
          <img src="https://www.vietnamairlines.com/~/media/Images/VNANew/Home/Logo/logo_vna_menu.png" alt="Logo" className="h-12 mb-8 filter brightness-0 invert" />
          <h2 className="text-4xl font-bold mb-4">Trở thành hội viên Bông Sen Vàng</h2>
          <p className="text-xl text-white/90">Tích lũy dặm bay, nâng hạng thẻ và tận hưởng hàng ngàn ưu đãi độc quyền trên mọi hành trình.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          
          <Button variant="ghost" className="flex items-center gap-2 mb-8 text-slate-500 hover:text-vna-blue rounded-lg transition-colors duration-200" onClick={() => navigate('/')}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại trang chủ
          </Button>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-vna-blue mb-3">Đăng ký tài khoản</h1>
            <p className="text-slate-600">Điền thông tin để gia nhập Lotusmiles.</p>
          </div>

          <Card className="shadow-lg border-0 rounded-xl">
            <CardContent className="p-8 rounded-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Tên (First Name)</Label>
                    <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Họ (Last Name)</Label>
                    <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required className="h-12 uppercase" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="h-12" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="h-12" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="h-12 pr-10"
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
                  <p className="text-xs text-slate-500 mt-1">Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.</p>
                </div>

                <Button type="submit" size="lg" className="w-full bg-vna-blue hover:bg-vna-blue/90 text-white text-base rounded-lg transition-colors duration-200" disabled={isLoading}>
                  {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Đăng ký Hội viên'}
                </Button>

                <p className="text-xs text-center text-slate-500">
                  Bằng việc đăng ký, bạn đồng ý với <a href="#" className="text-vna-blue underline">Điều khoản dịch vụ</a> và <a href="#" className="text-vna-blue underline">Chính sách bảo mật</a> của chúng tôi.
                </p>

              </form>
            </CardContent>
          </Card>

          <p className="text-center mt-8 text-slate-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-semibold text-vna-gold hover:underline transition-colors duration-200">
              Đăng nhập ngay
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

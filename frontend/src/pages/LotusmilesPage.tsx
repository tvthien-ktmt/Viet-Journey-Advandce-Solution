import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Plane, Star, Gift, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '@/store/authStore';

export default function LotusmilesPage() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  
  const getNextTier = (miles: number) => {
    if (miles < 30000) return { current: 'MEMBER', next: 'TITANIUM', req: 30000 };
    if (miles < 50000) return { current: 'TITANIUM', next: 'GOLD', req: 50000 };
    if (miles < 100000) return { current: 'GOLD', next: 'PLATINUM', req: 100000 };
    return { current: 'PLATINUM', next: 'PLATINUM', req: 100000 };
  };

  const getTierProgress = () => {
    if (!user) return 0;
    const { req } = getNextTier(user.lotusmilesMiles || 0);
    return Math.min(100, Math.round(((user.lotusmilesMiles || 0) / req) * 100));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center">
        <img 
          src="https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop" 
          alt="Lotusmiles" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl text-white">
            <div className="flex items-center gap-3 mb-6">
              <img src="https://www.vietnamairlines.com/~/media/Images/VNANew/Home/Logo/logo_vna_menu.png" alt="Logo" className="h-10 filter brightness-0 invert" />
              <div className="h-8 w-px bg-white/30"></div>
              <span className="text-xl font-bold tracking-widest uppercase">Lotusmiles</span>
            </div>
            
            {!isAuthenticated() ? (
              <>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Chương trình<br/><span className="text-vna-gold">Bông Sen Vàng</span></h1>
                <p className="text-lg text-slate-200 mb-10 leading-relaxed">
                  Tích lũy dặm bay, tận hưởng vô vàn đặc quyền đẳng cấp trên mọi hành trình cùng Vietnam Airlines và các đối tác liên minh SkyTeam.
                </p>
                <div className="flex gap-4">
                  <Button size="lg" className="bg-vna-gold hover:bg-vna-gold/90 text-white text-base h-14 px-8 rounded-lg transition-all duration-300" onClick={() => navigate('/register')}>
                    Đăng ký hội viên
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-base h-14 px-8 rounded-lg transition-all duration-300" onClick={() => navigate('/login')}>
                    Đăng nhập
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-2">Xin chào, {user?.fullName}</h1>
                <p className="text-vna-gold font-bold tracking-wider uppercase mb-8">Hội viên {user?.lotusmilesTier || 'MEMBER'}</p>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-8 max-w-lg">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-slate-300 text-sm mb-1">Dặm xét hạng hiện tại</p>
                      <p className="text-3xl font-bold">{user?.lotusmilesMiles?.toLocaleString('vi-VN') || 0}</p>
                    </div>
                    {getNextTier(user?.lotusmilesMiles || 0).current !== 'PLATINUM' && (
                      <div className="text-right">
                        <p className="text-slate-300 text-xs mb-1">Cần thêm để lên hạng {getNextTier(user?.lotusmilesMiles || 0).next}</p>
                        <p className="text-vna-gold font-bold">
                          {(getNextTier(user?.lotusmilesMiles || 0).req - (user?.lotusmilesMiles || 0)).toLocaleString('vi-VN')} dặm
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                    <div className="bg-vna-gold h-2 rounded-full" style={{ width: `${getTierProgress()}%` }}></div>
                  </div>
                </div>
                
                <Button size="lg" className="flex items-center gap-2 bg-white text-vna-blue hover:bg-slate-100 text-base h-14 px-8 rounded-lg transition-all duration-300" onClick={() => navigate('/profile')}>
                  Vào trang quản lý hồ sơ <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tiers Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          
          <Card className="bg-slate-800 text-white border-0 shadow-xl transform transition-transform hover:-translate-y-2 cursor-pointer rounded-xl">
            <CardContent className="p-6 rounded-xl">
              <div className="flex justify-between items-center mb-12">
                <Shield className="w-8 h-8 text-slate-400" />
                <span className="text-xs font-bold tracking-widest uppercase">Platinum</span>
              </div>
              <h3 className="text-lg font-bold">Thẻ Bạch Kim</h3>
              <p className="text-sm text-slate-400 mt-2">Đặc quyền tối thượng</p>
            </CardContent>
          </Card>

          <Card className="bg-vna-gold text-white border-0 shadow-xl transform transition-transform hover:-translate-y-2 cursor-pointer rounded-xl">
            <CardContent className="p-6 rounded-xl">
              <div className="flex justify-between items-center mb-12">
                <Shield className="w-8 h-8 text-yellow-200" />
                <span className="text-xs font-bold tracking-widest uppercase">Gold</span>
              </div>
              <h3 className="text-lg font-bold">Thẻ Vàng</h3>
              <p className="text-sm text-yellow-100 mt-2">Dịch vụ ưu tiên</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-400 text-white border-0 shadow-xl transform transition-transform hover:-translate-y-2 cursor-pointer rounded-xl">
            <CardContent className="p-6 rounded-xl">
              <div className="flex justify-between items-center mb-12">
                <Shield className="w-8 h-8 text-slate-200" />
                <span className="text-xs font-bold tracking-widest uppercase">Titanium</span>
              </div>
              <h3 className="text-lg font-bold">Thẻ Titan</h3>
              <p className="text-sm text-slate-200 mt-2">Nhiều tiện ích thêm</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-200 text-slate-800 border-0 shadow-xl transform transition-transform hover:-translate-y-2 cursor-pointer rounded-xl">
            <CardContent className="p-6 rounded-xl">
              <div className="flex justify-between items-center mb-12">
                <Shield className="w-8 h-8 text-slate-400" />
                <span className="text-xs font-bold tracking-widest uppercase">Silver</span>
              </div>
              <h3 className="text-lg font-bold">Thẻ Bạc</h3>
              <p className="text-sm text-slate-500 mt-2">Bắt đầu hành trình</p>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Main Benefits */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-vna-blue mb-4">Đặc quyền của Hội viên Bông Sen Vàng</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Tích lũy dặm bay cho mỗi hành trình và quy đổi thành vô vàn phần thưởng hấp dẫn.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-blue-50 text-vna-blue rounded-full flex items-center justify-center mb-6">
              <Plane className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Tích lũy dặm dễ dàng</h3>
            <p className="text-slate-600 mb-6">Tích lũy dặm khi bay cùng Vietnam Airlines, các hãng hàng không SkyTeam và sử dụng dịch vụ của đối tác phi hàng không.</p>
            <Button variant="link" className="flex items-center gap-2 text-vna-blue font-semibold rounded-lg">Tìm hiểu thêm <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-amber-50 text-vna-gold rounded-full flex items-center justify-center mb-6">
              <Gift className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Đổi dặm lấy phần thưởng</h3>
            <p className="text-slate-600 mb-6">Sử dụng dặm tích lũy để lấy vé máy bay miễn phí, nâng hạng ghế hoặc phần thưởng từ các đối tác liên kết.</p>
            <Button variant="link" className="flex items-center gap-2 text-vna-blue font-semibold rounded-lg">Tìm hiểu thêm <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
              <Star className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Dịch vụ ưu tiên ưu việt</h3>
            <p className="text-slate-600 mb-6">Tận hưởng phòng chờ hạng Thương gia, quầy làm thủ tục ưu tiên, hành lý miễn cước và lên máy bay trước.</p>
            <Button variant="link" className="flex items-center gap-2 text-vna-blue font-semibold rounded-lg">Tìm hiểu thêm <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>

        </div>
      </div>

    </div>
  );
}

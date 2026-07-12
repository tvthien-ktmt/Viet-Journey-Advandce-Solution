import React, { useEffect } from 'react';
import { useAuth } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Plane, Award, History, Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/api/profile';

export default function LotusmilesPage() {
  const { user, initAuth } = useAuth();
  const _navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      _navigate('/login');
    } else {
      initAuth();
    }
  }, [user, _navigate, initAuth]);

  const { data: loyaltyData, isLoading: _isLoading } = useQuery({
    queryKey: ['loyaltyHistory'],
    queryFn: () => profileApi.getLoyaltyHistory(),
    enabled: !!user
  });

  if (!user) return null;

  const tier = loyaltyData?.data?.tier || user.lotusmilesTier || 'SILVER';
  const miles = loyaltyData?.data?.miles || user.lotusmilesMiles || 0;
  const _history = loyaltyData?.data?.history || [];
  
  const nextTierMiles = tier === 'SILVER' ? 1000 : tier === 'TITANIUM' ? 5000 : tier === 'GOLD' ? 10000 : miles;
  const progress = Math.min((miles / nextTierMiles) * 100, 100);

  const tierColors = {
    SILVER: 'bg-slate-300 text-slate-700 border-slate-400',
    TITANIUM: 'bg-slate-700 text-white border-slate-800',
    GOLD: 'bg-yellow-400 text-yellow-900 border-yellow-500',
    PLATINUM: 'bg-stone-800 text-stone-200 border-stone-900',
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-vna-blue flex items-center gap-2">
            <Award className="w-8 h-8 text-vna-gold" />
            Bông Sen Vàng (Lotusmiles)
          </h1>
          <p className="text-slate-500 mt-2">Quản lý dặm bay và hạng thẻ thành viên của bạn</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-sm border-vna-border">
            <CardHeader>
              <CardTitle className="text-lg">Thẻ thành viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("p-6 rounded-2xl border-2 shadow-inner relative overflow-hidden", tierColors[tier as keyof typeof tierColors] || tierColors.SILVER)}>
                <div className="absolute -right-4 -top-4 opacity-10">
                  <Plane className="w-40 h-40 transform rotate-45" />
                </div>
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold opacity-80 mb-1">Hạng thẻ</p>
                    <p className="text-2xl font-black uppercase tracking-widest">{tier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold opacity-80 mb-1">Tổng dặm</p>
                    <p className="text-3xl font-black">{miles.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-8 relative z-10">
                  <p className="text-sm font-semibold opacity-80 mb-2 uppercase tracking-wider">{user.fullName}</p>
                  <p className="text-xs opacity-70">Hiệu lực đến: 12/2026</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2 text-slate-600 font-medium">
                  <span>Tiến độ lên hạng {tier === 'SILVER' ? 'TITANIUM' : tier === 'TITANIUM' ? 'GOLD' : tier === 'GOLD' ? 'PLATINUM' : 'MAX'}</span>
                  <span>{miles.toLocaleString()} / {nextTierMiles.toLocaleString()} dặm</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <div className="bg-vna-blue h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-vna-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-vna-gold" />
                Đặc quyền hạng thẻ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="font-semibold text-sm">Tích lũy dặm bay</p>
                    <p className="text-xs text-slate-500">Tích lũy dặm từ các chuyến bay và dịch vụ đối tác</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="font-semibold text-sm">Đổi dặm lấy thưởng</p>
                    <p className="text-xs text-slate-500">Mua vé bằng dặm, mua thêm hành lý, nâng hạng ghế</p>
                  </div>
                </li>
                <li className={cn("flex items-start gap-3", tier === 'SILVER' ? 'opacity-40 grayscale' : '')}>
                  <CheckIcon />
                  <div>
                    <p className="font-semibold text-sm">Ưu tiên check-in</p>
                    <p className="text-xs text-slate-500">Làm thủ tục tại quầy ưu tiên (Từ hạng Titanium)</p>
                  </div>
                </li>
                <li className={cn("flex items-start gap-3", ['SILVER', 'TITANIUM'].includes(tier) ? 'opacity-40 grayscale' : '')}>
                  <CheckIcon />
                  <div>
                    <p className="font-semibold text-sm">Phòng chờ Thương gia</p>
                    <p className="text-xs text-slate-500">Miễn phí sử dụng phòng chờ (Từ hạng Gold)</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 shadow-sm border-vna-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-vna-blue" />
              Lịch sử giao dịch dặm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 border-2 border-dashed rounded-xl border-slate-200">
              <Clock className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">Chưa có giao dịch dặm nào gần đây</p>
              <p className="text-sm text-slate-400 mt-1">Các giao dịch phát sinh từ chuyến bay sẽ hiển thị tại đây.</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    </div>
  )
}

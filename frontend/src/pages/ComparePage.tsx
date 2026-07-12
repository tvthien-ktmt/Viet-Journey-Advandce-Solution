import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { Button } from '@/components/ui';
import { CheckCircle2, XCircle, Plane, Briefcase, Sofa } from 'lucide-react';

export default function ComparePage() {
  const _navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-vna-blue mb-4">So Sánh Các Hạng Dịch Vụ</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Vietnam Airlines tự hào mang đến trải nghiệm bay đẳng cấp với 3 hạng dịch vụ chính. Hãy khám phá và lựa chọn hạng vé phù hợp nhất cho chuyến đi của bạn.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Economy */}
          <Card className="border-t-4 border-t-vna-blue shadow-md hover:shadow-xl transition-shadow relative overflow-hidden flex flex-col rounded-xl">
            <CardHeader className="bg-slate-50 border-b text-center py-8 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 text-vna-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Phổ Thông</h2>
              <p className="text-slate-500 mt-2 text-sm">Tiện nghi và tiết kiệm</p>
            </CardHeader>
            <CardContent className="p-8 flex-1 flex flex-col rounded-xl">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-green-500 shrink-0 mt-0.5" /> <span className="text-slate-700">Ghế ngồi thoải mái, ngả lưng 5-6 inch</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-green-500 shrink-0 mt-0.5" /> <span className="text-slate-700">Màn hình giải trí cá nhân (trên một số tàu bay)</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-green-500 shrink-0 mt-0.5" /> <span className="text-slate-700">Suất ăn nóng/nhẹ tùy hành trình</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-green-500 shrink-0 mt-0.5" /> <span className="text-slate-700">Hành lý xách tay: 12kg</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-green-500 shrink-0 mt-0.5" /> <span className="text-slate-700">Hành lý ký gửi: 23kg (tùy điều kiện vé)</span></li>
                <li className="flex items-start opacity-50"><XCircle className="w-5 h-5 mr-3 text-red-400 shrink-0 mt-0.5" /> <span className="text-slate-500 line-through">Phòng chờ Thương gia</span></li>
                <li className="flex items-start opacity-50"><XCircle className="w-5 h-5 mr-3 text-red-400 shrink-0 mt-0.5" /> <span className="text-slate-500 line-through">Lối đi ưu tiên SkyPriority</span></li>
              </ul>
              <Button variant="outline" className="w-full h-12 border-vna-blue text-vna-blue hover:bg-blue-50 mt-auto rounded-lg transition-all duration-300" onClick={() => _navigate('/')}>
                Đặt vé Phổ thông
              </Button>
            </CardContent>
          </Card>

          {/* Premium Economy */}
          <Card className="border-t-4 border-t-vna-gold shadow-xl transform lg:-translate-y-4 relative overflow-hidden flex flex-col rounded-xl">
            <div className="absolute top-4 right-[-30px] bg-red-500 text-white font-bold text-xs py-1 px-10 rotate-45 shadow-sm">
              HOT
            </div>
            <CardHeader className="bg-amber-50 border-b border-amber-100 text-center py-8 rounded-xl">
              <div className="w-16 h-16 bg-white text-vna-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-amber-100">
                <Sofa className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Phổ Thông Đặc Biệt</h2>
              <p className="text-amber-700 mt-2 text-sm font-medium">Trải nghiệm nâng tầm</p>
            </CardHeader>
            <CardContent className="p-8 flex-1 flex flex-col rounded-xl">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-vna-gold shrink-0 mt-0.5" /> <span className="text-slate-700 font-medium">Ghế ngồi rộng rãi hơn, độ ngả lưng 7-8 inch</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-green-500 shrink-0 mt-0.5" /> <span className="text-slate-700">Màn hình giải trí cá nhân 10.6 inch</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-vna-gold shrink-0 mt-0.5" /> <span className="text-slate-700 font-medium">Thực đơn đặc biệt đa dạng, thức uống cao cấp</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-vna-gold shrink-0 mt-0.5" /> <span className="text-slate-700 font-medium">Hành lý xách tay: 18kg (2 kiện)</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-green-500 shrink-0 mt-0.5" /> <span className="text-slate-700">Hành lý ký gửi: 32kg</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-vna-gold shrink-0 mt-0.5" /> <span className="text-slate-700 font-medium">Quầy làm thủ tục riêng</span></li>
                <li className="flex items-start opacity-50"><XCircle className="w-5 h-5 mr-3 text-red-400 shrink-0 mt-0.5" /> <span className="text-slate-500 line-through">Phòng chờ Thương gia</span></li>
              </ul>
              <Button className="w-full h-12 bg-vna-gold hover:bg-vna-gold/90 text-white mt-auto rounded-lg transition-all duration-300" onClick={() => _navigate('/')}>
                Đặt vé Phổ thông ĐB
              </Button>
            </CardContent>
          </Card>

          {/* Business */}
          <Card className="border-t-4 border-t-slate-800 shadow-md hover:shadow-xl transition-shadow relative overflow-hidden flex flex-col bg-slate-900 text-white rounded-xl">
            <CardHeader className="bg-slate-800 border-b border-slate-700 text-center py-8 rounded-xl">
              <div className="w-16 h-16 bg-slate-700 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">Thương Gia</h2>
              <p className="text-slate-400 mt-2 text-sm">Đẳng cấp doanh nhân</p>
            </CardHeader>
            <CardContent className="p-8 flex-1 flex flex-col rounded-xl">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-white shrink-0 mt-0.5" /> <span>Ghế ngả phẳng 180 độ thành giường (B787/A350)</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-white shrink-0 mt-0.5" /> <span>Màn hình cá nhân 15.4 inch, tai nghe chống ồn</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-white shrink-0 mt-0.5" /> <span>Ẩm thực Fine Dining, rượu vang thượng hạng</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-white shrink-0 mt-0.5" /> <span>Hành lý xách tay: 18kg (2 kiện)</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-white shrink-0 mt-0.5" /> <span>Hành lý ký gửi: 32kg - 40kg (Ưu tiên gắn thẻ)</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-vna-gold shrink-0 mt-0.5" /> <span className="text-vna-gold font-bold">Sử dụng Phòng chờ Thương gia (Lotus Lounge)</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-vna-gold shrink-0 mt-0.5" /> <span className="text-vna-gold font-bold">Đặc quyền SkyPriority toàn diện</span></li>
              </ul>
              <Button className="w-full h-12 bg-white text-vna-text hover:bg-slate-200 mt-auto font-bold rounded-lg transition-all duration-300" onClick={() => _navigate('/')}>
                Trải nghiệm Thương Gia
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}


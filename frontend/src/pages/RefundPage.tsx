import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { ChevronLeft, RefreshCcw, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RefundPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  interface RefundBooking {
    id: string;
    route: string;
    date: string;
    price: number;
    refundFee: number;
    passengers: number;
  }
  const [booking, setBooking] = useState<RefundBooking | null>(null);
  const [isRefunding, setIsRefunding] = useState(false);
  const [isRefunded, setIsRefunded] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !email) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      // MOCK
      if (code.toUpperCase() === 'BK1234') {
        setBooking({
          id: 'BK1234',
          route: 'Hà Nội (HAN) - TP. Hồ Chí Minh (SGN)',
          date: '15/10/2025',
          price: 3500000,
          refundFee: 500000,
          passengers: 2,
        });
      } else {
        toast.error('Không tìm thấy đặt chỗ');
      }
    }, 1000);
  };

  const handleRefund = () => {
    setIsRefunding(true);
    setTimeout(() => {
      setIsRefunding(false);
      setIsRefunded(true);
      toast.success('Yêu cầu hoàn vé đã được tiếp nhận!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="flex items-center gap-4 mb-8">
          <Button className="flex items-center gap-2 rounded-lg" variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-vna-blue">Hủy Đặt Chỗ / Hoàn Vé</h1>
            <p className="text-slate-500">Thực hiện hủy và hoàn tiền theo điều kiện giá vé</p>
          </div>
        </div>

        {!booking && !isRefunded && (
          <Card>
            <CardHeader>
              <CardTitle>Tra cứu thông tin đặt chỗ</CardTitle>
              <CardDescription>Vui lòng nhập mã đặt chỗ và địa chỉ email dùng để mua vé.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Mã đặt chỗ</Label>
                    <Input 
                      placeholder="VD: BK1234" 
                      className="uppercase rounded-lg" 
                      value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email liên hệ</Label>
                    <Input 
                      type="email"
                      placeholder="VD: email@example.com"
                      value={email} onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="flex items-center gap-2 w-full bg-vna-blue rounded-lg" disabled={isSearching}>
                  {isSearching ? 'Đang tìm kiếm...' : <><Search className="w-4 h-4 mr-2" /> Tra cứu</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {booking && !isRefunded && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <Card>
              <CardHeader className="bg-slate-50 border-b rounded-xl">
                <CardTitle className="text-xl rounded-xl">Thông tin hoàn vé (Mã: {booking.id})</CardTitle>
              </CardHeader>
              <CardContent className="p-6 rounded-xl">
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-slate-500">Hành trình</span>
                    <span className="font-semibold">{booking.route}</span>
                  </div>
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-slate-500">Ngày khởi hành</span>
                    <span className="font-semibold">{booking.date}</span>
                  </div>
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-slate-500">Số lượng khách</span>
                    <span className="font-semibold">{booking.passengers} Hành khách</span>
                  </div>
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-slate-500">Tổng tiền vé đã thanh toán</span>
                    <span className="font-semibold">{booking.price.toLocaleString()} ₫</span>
                  </div>
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-red-500 font-medium">Phí hoàn vé (Theo điều kiện giá)</span>
                    <span className="font-semibold text-red-500">-{booking.refundFee.toLocaleString()} ₫</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-lg font-bold">Số tiền hoàn dự kiến</span>
                    <span className="text-2xl font-bold text-vna-blue">{(booking.price - booking.refundFee).toLocaleString()} ₫</span>
                  </div>
                </div>

                <div className="mt-8 bg-amber-50 text-amber-800 p-4 rounded-lg flex gap-3 text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p>Lưu ý: Hành động này không thể hoàn tác. Chỗ ngồi của bạn sẽ bị hủy ngay lập tức. Tiền hoàn sẽ được chuyển về tài khoản thẻ trong vòng 5-7 ngày làm việc.</p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-4 rounded-xl">
                <Button variant="outline" className="w-full rounded-lg" onClick={() => setBooking(null)}>Hủy bỏ</Button>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300" onClick={handleRefund} disabled={isRefunding}>
                  {isRefunding ? 'Đang xử lý...' : 'Xác nhận Hủy Đặt Chỗ'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {isRefunded && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Đã gửi yêu cầu hoàn vé!</h2>
            <p className="text-slate-500 mb-6">Mã tham chiếu: <strong>RF-{Math.floor(Math.random()*10000)}</strong><br/>Chúng tôi đã gửi email xác nhận cho bạn.</p>
            <Button onClick={() => navigate('/')}>Về trang chủ</Button>
          </div>
        )}

      </div>
    </div>
  );
}


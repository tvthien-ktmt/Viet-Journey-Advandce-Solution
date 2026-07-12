import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { ChevronLeft, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { bookingApi } from '@/api/booking';

export default function RefundPage() {
  const _navigate = useNavigate();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState(''); // We use this for lastName now
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !email) return;
    setIsSearching(true);
    try {
      const b = await bookingApi.search(code, email);
      if (b.status === 'CANCELLED' || b.status === 'EXPIRED') {
        toast.error('Đặt chỗ này đã bị hủy hoặc hết hạn');
        setBooking(null);
        return;
      }
      
      let snap: Record<string, string> = {};
      try { snap = JSON.parse(b.itemSnapshot || '{}'); } catch {}
      
      setBooking({
        id: b.id.toString(),
        route: snap.from && snap.to ? `${snap.from} - ${snap.to}` : 'Không rõ',
        date: b.createdAt ? new Date(b.createdAt).toLocaleDateString('vi-VN') : 'N/A',
        price: b.totalPrice || 0,
        refundFee: 500000,
        passengers: b.passengers?.length || 1,
      });
    } catch {
      toast.error('Không tìm thấy đặt chỗ');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRefund = async () => {
    if (!booking) return;
    setIsRefunding(true);
    try {
      await bookingApi.cancelBooking(booking.id);
      setIsRefunded(true);
      toast.success('Yêu cầu hoàn vé đã được tiếp nhận và xử lý!');
    } catch {
      toast.error('Không thể hoàn vé lúc này');
    } finally {
      setIsRefunding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="flex items-center gap-4 mb-8">
          <Button className="flex items-center gap-2 rounded-lg" variant="ghost" size="icon" onClick={() => _navigate(-1)}>
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
                    <Label>Họ hành khách</Label>
                    <Input 
                      type="text"
                      placeholder="VD: NGUYEN"
                      className="uppercase"
                      value={email} onChange={e => setEmail(e.target.value.toUpperCase())}
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
            <Button onClick={() => _navigate('/')}>Về trang chủ</Button>
          </div>
        )}

      </div>
    </div>
  );
}


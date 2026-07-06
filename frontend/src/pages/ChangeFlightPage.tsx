import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Search, CalendarDays, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ChangeFlightPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  interface ChangeFlightBooking {
    id: string;
    route: string;
    oldDate: string;
    flightNo: string;
    changeFee: number;
    fareDifference: number;
  }
  const [booking, setBooking] = useState<ChangeFlightBooking | null>(null);
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [newDate, setNewDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
          route: 'HAN - SGN',
          oldDate: '15/10/2025',
          flightNo: 'VN201',
          changeFee: 350000,
          fareDifference: 150000,
        });
        setStep(2);
      } else {
        toast.error('Không tìm thấy đặt chỗ');
      }
    }, 1000);
  };

  const handleConfirmChange = () => {
    if (!newDate) {
      toast.error('Vui lòng chọn ngày mới');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
      toast.success('Đổi chuyến thành công!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="flex items-center gap-4 mb-8">
          <Button className="flex items-center gap-2 rounded-lg" variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-vna-blue">Đổi Ngày / Đổi Chuyến</h1>
            <p className="text-slate-500">Thay đổi lịch trình bay theo nhu cầu của bạn</p>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Tra cứu thông tin đặt chỗ</CardTitle>
              <CardDescription>Nhập mã đặt chỗ và email để bắt đầu đổi chuyến.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Mã đặt chỗ</Label>
                    <Input placeholder="VD: BK1234" className="uppercase rounded-lg" value={code} onChange={e => setCode(e.target.value.toUpperCase())} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Email liên hệ</Label>
                    <Input type="email" placeholder="VD: email@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <Button type="submit" className="flex items-center gap-2 w-full bg-vna-blue rounded-lg" disabled={isSearching}>
                  {isSearching ? 'Đang tìm...' : <><Search className="w-4 h-4 mr-2" /> Tra cứu</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && booking && (
          <div className="space-y-6 animate-in fade-in">
            <Card>
              <CardHeader className="bg-slate-50 border-b rounded-xl">
                <CardTitle className="text-xl rounded-xl">Chi tiết thay đổi (Mã: {booking.id})</CardTitle>
              </CardHeader>
              <CardContent className="p-6 rounded-xl">
                
                <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg mb-6">
                  <div>
                    <p className="text-sm text-slate-500">Hành trình hiện tại</p>
                    <p className="font-bold text-vna-blue">{booking.route}</p>
                    <p className="text-sm font-semibold">{booking.oldDate} ({booking.flightNo})</p>
                  </div>
                  <ArrowRight className="text-slate-400" />
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Chuyến bay mới</p>
                    <p className="font-bold text-vna-blue">{booking.route}</p>
                    <p className="text-sm font-semibold">{newDate ? newDate : 'Chưa chọn'}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <Label>Chọn ngày bay mới</Label>
                  <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="h-12" />
                </div>

                {newDate && (
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Phí đổi chuyến</span>
                      <span>{booking.changeFee.toLocaleString()} ₫</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Chênh lệch giá vé (nếu có)</span>
                      <span>{booking.fareDifference.toLocaleString()} ₫</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Tổng phí phải thanh toán</span>
                      <span className="text-xl text-vna-blue">{(booking.changeFee + booking.fareDifference).toLocaleString()} ₫</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-4 rounded-xl">
                <Button variant="outline" className="w-full rounded-lg" onClick={() => setStep(1)}>Quay lại</Button>
                <Button className="w-full bg-vna-gold hover:bg-vna-gold/90 text-white rounded-lg transition-all duration-300" onClick={handleConfirmChange} disabled={!newDate || isProcessing}>
                  {isProcessing ? 'Đang xử lý...' : 'Thanh toán & Đổi chuyến'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Đổi chuyến thành công!</h2>
            <p className="text-slate-500 mb-6">Mã đặt chỗ của bạn được giữ nguyên: <strong>BK1234</strong><br/>Vé điện tử mới đã được gửi vào email của bạn.</p>
            <Button onClick={() => navigate(`/manage`)}>Quản lý đặt chỗ</Button>
          </div>
        )}

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { useT } from '@/store/langStore';
import { Search, MapPin, Calendar, Clock, Ticket, AlertCircle, Plane, Printer, Edit, XCircle, Settings, Armchair } from 'lucide-react';
import { toast } from 'sonner';
import { bookingApi } from '@/api/booking';

export default function ManageBookingPage() {
  const t = useT();
  const navigate = useNavigate();
  
  const [code, setCode] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  interface FlightBooking {
    id: string;
    bookingCode: string;
    status: string;
    route: string;
    from: string;
    to: string;
    departTime: string;
    arriveTime: string;
    passengers: string[];
    amount: number;
    flightNo: string;
    date: string;
  }
  const [booking, setBooking] = useState<FlightBooking | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !lastName) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    setIsSearching(true);
    setHasSearched(false);
    
    try {
      const b = await bookingApi.search(code, lastName);
      let snap: Record<string, string> = {};
      try { snap = JSON.parse(b.itemSnapshot || '{}'); } catch(e) {}
      
      setBooking({
        id: b.id ? `${b.id}` : b.bookingCode || code,
        bookingCode: b.bookingCode || code,
        route: snap.from && snap.to ? `${snap.from} - ${snap.to}` : 'Không có thông tin',
        status: b.status,
        flightNo: snap.flightNo || 'Không rõ',
        date: b.createdAt ? new Date(b.createdAt).toLocaleDateString('vi-VN') : 'Không có thông tin',
        from: snap.from || 'N/A',
        to: snap.to || 'N/A',
        departTime: snap.departTime || '--:--',
        arriveTime: snap.arriveTime || '--:--',
        passengers: b.passengers?.map(p => p.fullName) || [],
        amount: b.totalPrice || 0,
      });
      setHasSearched(true);
    } catch (e) {
      const error = e as Error & { response?: { data?: { message?: string } } };
      setBooking(null);
      setHasSearched(true);
      toast.error(error.response?.data?.message || 'Không tìm thấy đặt chỗ');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-vna-blue mb-4">{t('manage.title')}</h1>
          <p className="text-slate-600">Tra cứu thông tin, đổi chuyến, hoàn vé hoặc mua thêm hành lý và chỗ ngồi.</p>
        </div>

        <Card className="mb-10 shadow-md rounded-xl">
          <CardContent className="p-6 rounded-xl">
            <form onSubmit={handleSearch} className="grid md:grid-cols-5 gap-6 items-end">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="code">{t('manage.code')}</Label>
                <Input 
                  id="code" 
                  placeholder={t('manage.codePlaceholder')} 
                  className="uppercase font-semibold tracking-wider rounded-lg"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="lastName">{t('manage.lastName')}</Label>
                <Input 
                  id="lastName" 
                  placeholder={t('manage.lastNamePlaceholder')}
                  className="uppercase font-semibold tracking-wider rounded-lg"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value.toUpperCase())}
                />
              </div>
              <div className="md:col-span-1">
                <Button type="submit" className="flex items-center gap-2 w-full bg-vna-gold hover:bg-vna-gold/90 text-white rounded-lg transition-all duration-300" disabled={isSearching}>
                  {isSearching ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Search className="w-4 h-4 mr-2"/> {t('manage.search')}</>}
                </Button>
              </div>
            </form>
            <div className="mt-4 text-sm text-slate-500 flex items-center justify-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <AlertCircle className="w-4 h-4 text-vna-blue" />
              <span>Gợi ý trải nghiệm: Nhập mã <strong className="text-vna-blue">BK1234</strong> và họ <strong className="text-vna-blue">NGUYEN</strong> để xem dữ liệu mẫu.</span>
            </div>
          </CardContent>
        </Card>

        {isSearching && (
          <div className="grid lg:grid-cols-3 gap-6 animate-pulse">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="border-b bg-slate-50 rounded-t-xl pb-4">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-1/3 mt-2" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full mt-6" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                <CardContent><Skeleton className="h-20 w-full" /></CardContent>
              </Card>
            </div>
          </div>
        )}

        {hasSearched && !isSearching && !booking && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
            <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">{t('manage.notFound')}</h2>
            <p className="text-slate-500 mb-6">{t('manage.notFoundDesc')}</p>
            <Button variant="outline" onClick={() => navigate('/help')}>Cần hỗ trợ?</Button>
          </div>
        )}

        {booking && (
          <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="border-b bg-slate-50 rounded-t-xl pb-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl text-vna-blue flex items-center gap-2 rounded-xl">
                        <Ticket className="w-5 h-5" /> Mã Đặt Chỗ: {booking.bookingCode}
                      </CardTitle>
                      <CardDescription className="mt-1 rounded-xl">Trạng thái: <strong className="text-green-600">{
                        {
                          RESERVED: 'Chờ thanh toán',
                          CONFIRMED: 'Đã xác nhận',
                          CANCELLED: 'Đã hủy',
                          EXPIRED: 'Hết hạn',
                        }[booking.status] || booking.status
                      }</strong></CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Ngày đặt</p>
                      <p className="font-medium">{booking.date}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 rounded-xl">
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-vna-blue">{booking.from}</p>
                      <p className="text-sm font-medium mt-1">{booking.route.split(' - ')[0]}</p>
                      <p className="text-xs text-slate-500">{booking.departTime}</p>
                    </div>
                    
                    <div className="flex-1 px-8 flex flex-col items-center">
                      <div className="flex items-center text-slate-400 text-xs font-semibold mb-2">
                        <Clock className="w-3 h-3 mr-1" /> 2h 15m
                      </div>
                      <div className="w-full relative flex items-center justify-center">
                        <div className="w-full h-px bg-slate-300 absolute" />
                        <Plane className="w-6 h-6 text-vna-gold bg-white px-1 z-10" />
                      </div>
                      <div className="text-vna-blue font-bold mt-2">{booking.flightNo}</div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-3xl font-bold text-vna-blue">{booking.to}</p>
                      <p className="text-sm font-medium mt-1">{booking.route.split(' - ')[1]}</p>
                      <p className="text-xs text-slate-500">{booking.arriveTime}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
                    <div>
                      <p className="text-sm text-slate-500 mb-1 flex items-center gap-1"><Calendar className="w-4 h-4"/> Ngày khởi hành</p>
                      <p className="font-semibold">{booking.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4"/> Hành khách ({booking.passengers.length})</p>
                      <p className="font-semibold line-clamp-1">{booking.passengers.join(', ')}</p>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg">Quản lý chuyến bay</h3>
              
              <Button variant="outline" className="flex items-center gap-2 w-full justify-start h-12 rounded-lg" onClick={() => navigate(`/booking/${booking.id}/seats`)}>
                <Armchair className="w-5 h-5 mr-3 text-vna-blue" /> Chọn chỗ ngồi
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2 w-full justify-start h-12 rounded-lg" onClick={() => navigate(`/booking/${booking.id}/extras`)}>
                <Settings className="w-5 h-5 mr-3 text-vna-blue" /> Mua thêm tiện ích (Hành lý, suất ăn)
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2 w-full justify-start h-12 rounded-lg" onClick={() => navigate(`/manage/${booking.id}/change`)}>
                <Edit className="w-5 h-5 mr-3 text-vna-gold" /> Đổi ngày / Đổi chuyến
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2 w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300" onClick={() => navigate(`/refund`)}>
                <XCircle className="w-5 h-5 mr-3" /> Hủy đặt chỗ / Hoàn vé
              </Button>
              
              <div className="pt-4 border-t border-slate-200 mt-6">
                <Button variant="ghost" className="flex items-center gap-2 w-full justify-start text-slate-600 rounded-lg" onClick={handlePrint}>
                  <Printer className="w-5 h-5 mr-3" /> In biên nhận vé điện tử
                </Button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}


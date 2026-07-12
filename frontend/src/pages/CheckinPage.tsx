import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { useT } from '@/store/langStore';
import { CheckCircle2, PlaneTakeoff, Printer, Download, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { bookingApi } from '@/api/booking';

export default function CheckinPage() {
  const _t = useT();
  const [code, setCode] = useState('');
  const [lastName, setLastName] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSearching, setIsSearching] = useState(false);
  interface FlightBooking {
    id: string;
    bookingCode: string;
    route: string;
    from: string;
    to: string;
    flightNo: string;
    date: string;
    departTime: string;
    arriveTime: string;
    gate: string;
    passengers: { id: string, name: string, seat: string, type?: string, fullName?: string, seatNumber?: string }[];
    qrCodeUrl?: string;
  }
  const [booking, setBooking] = useState<FlightBooking | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !lastName) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    setIsSearching(true);
    try {
      const data: any = await bookingApi.search(code, lastName);
      if (data && data.bookingType === 'flight') {
        const flight = data.flight;
        setBooking({
          id: String(data.id),
          bookingCode: data.bookingCode,
          route: `${flight?.departureAirport} - ${flight?.arrivalAirport}`,
          flightNo: flight?.flightNumber || 'VN000',
          date: new Date(flight?.departureTime).toLocaleDateString('vi-VN'),
          from: flight?.departureAirport || '',
          to: flight?.arrivalAirport || '',
          departTime: new Date(flight?.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          arriveTime: new Date(flight?.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          gate: 'TBD',
          passengers: data.passengers || []
        });
        setStep(2);
      } else {
        toast.error('Không tìm thấy chuyến bay phù hợp');
      }
    } catch {
      toast.error('Không tìm thấy đặt chỗ phù hợp để làm thủ tục.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCompleteCheckin = async () => {
    try {
      const res: any = await bookingApi.checkin(code, lastName);
      if (res && res.success) {
        toast.success('Làm thủ tục thành công!');
        setBooking(prev => prev ? { ...prev, qrCodeUrl: res.data.qrCodeUrl } : null);
        setStep(3);
      }
    } catch {
      toast.error('Có lỗi xảy ra khi check-in');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24 print:bg-white print:pt-0 print:pb-0">
      
      {/* Non-printable header */}
      <div className="max-w-4xl mx-auto px-4 print:hidden">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-vna-blue mb-4">{_t('checkin.title')}</h1>
          <p className="text-slate-600">Làm thủ tục trực tuyến tiết kiệm thời gian chờ đợi tại sân bay.</p>
        </div>

        {/* Stepper */}
        <div className="flex justify-center items-center mb-10">
          <div className={`flex flex-col items-center w-24 ${step >= 1 ? 'text-vna-blue' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 1 ? 'bg-vna-blue text-white' : 'bg-slate-200'}`}>1</div>
            <span className="text-xs text-center font-medium">Tìm chuyến</span>
          </div>
          <div className={`h-1 w-16 mb-6 ${step >= 2 ? 'bg-vna-blue' : 'bg-slate-200'}`} />
          <div className={`flex flex-col items-center w-24 ${step >= 2 ? 'text-vna-blue' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 2 ? 'bg-vna-blue text-white' : 'bg-slate-200'}`}>2</div>
            <span className="text-xs text-center font-medium">Xác nhận</span>
          </div>
          <div className={`h-1 w-16 mb-6 ${step >= 3 ? 'bg-vna-blue' : 'bg-slate-200'}`} />
          <div className={`flex flex-col items-center w-24 ${step >= 3 ? 'text-vna-blue' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 3 ? 'bg-vna-blue text-white' : 'bg-slate-200'}`}>3</div>
            <span className="text-xs text-center font-medium">Thẻ lên tàu</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Step 1: Search */}
        {step === 1 && (
          <Card className="shadow-md print:hidden rounded-xl">
            <CardContent className="p-8 rounded-xl">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 mb-8 text-sm text-vna-blue">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>Thủ tục trực tuyến mở từ <strong>24 giờ</strong> đến <strong>1 giờ</strong> trước giờ khởi hành. Nhập mã <strong className="bg-white px-1 rounded">BK1234</strong> và họ <strong className="bg-white px-1 rounded">NGUYEN</strong> để xem demo.</p>
              </div>

              <form onSubmit={handleSearch} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="code">{_t('manage.code')}</Label>
                  <Input 
                    id="code" 
                    placeholder={_t('manage.codePlaceholder')} 
                    className="uppercase font-semibold tracking-wider h-12 rounded-lg"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{_t('manage.lastName')}</Label>
                  <Input 
                    id="lastName" 
                    placeholder={_t('manage.lastNamePlaceholder')}
                    className="uppercase font-semibold tracking-wider h-12 rounded-lg"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="md:col-span-2 text-center mt-4">
                  <Button type="submit" size="lg" className="w-full md:w-auto min-w-[200px] bg-vna-gold hover:bg-vna-gold/90 text-white rounded-lg transition-all duration-300" disabled={isSearching}>
                    {isSearching ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : _t('checkin.onlineCheckin')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Confirm Passengers */}
        {step === 2 && booking && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 print:hidden">
            <Card className="mb-6 border-t-4 border-t-vna-blue shadow-md rounded-xl">
              <CardContent className="p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4 border-b pb-4">
                  <div>
                    <h3 className="font-bold text-lg">{booking.flightNo}</h3>
                    <p className="text-slate-500 text-sm">{booking.date}</p>
                  </div>
                  <div className="flex items-center gap-4 text-vna-blue font-bold text-xl">
                    <span>{booking.from}</span>
                    <PlaneTakeoff className="w-5 h-5" />
                    <span>{booking.to}</span>
                  </div>
                </div>

                <h4 className="font-semibold mb-4 text-slate-800">{_t('checkin.passengers')}</h4>
                <div className="space-y-3 mb-8">
                  {booking.passengers.map((p: {id: string, name: string, seat: string}, _idx: number) => (
                    <div key={p.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="font-semibold">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500">{_t('checkin.seat')}:</span>
                        <span className="font-bold bg-white px-3 py-1 rounded border border-slate-200">{p.seat}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm mb-6 flex gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>Vui lòng đảm bảo bạn không mang theo các vật phẩm nguy hiểm trong hành lý xách tay và hành lý ký gửi theo quy định của nhà chức trách.</p>
                </div>

                <div className="flex gap-4 justify-end">
                  <Button variant="outline" onClick={() => setStep(1)}>Quay lại</Button>
                  <Button className="bg-vna-gold hover:bg-vna-gold/90 text-white rounded-lg transition-all duration-300" onClick={handleCompleteCheckin}>
                    {_t('checkin.complete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Boarding Pass */}
        {step === 3 && booking && (
          <div className="animate-in fade-in zoom-in-95 duration-500 space-y-8">
            
            <div className="text-center print:hidden">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Check-in thành công!</h2>
              <p className="text-slate-500 mb-6">Lưu ý: Cửa ra máy bay có thể thay đổi, vui lòng theo dõi bảng điện tử tại sân bay.</p>
              
              <div className="flex gap-4 justify-center mb-8">
                <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2">
                  <Printer className="w-4 h-4" /> {_t('checkin.print')}
                </Button>
                <Button className="flex items-center gap-2 bg-vna-blue text-white rounded-lg">
                  <Download className="w-4 h-4" /> Lưu về máy
                </Button>
              </div>
            </div>

            {/* Boarding Pass Cards (Rendered for Print) */}
            <div className="space-y-6">
              {booking.passengers.map((p: any) => (
                <div key={p.id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col md:flex-row print:shadow-none print:border print:border-black print:mb-8 break-inside-avoid">
                  
                  {/* Left Side (Main) */}
                  <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-dashed border-slate-300 print:border-r print:border-black print:border-dashed">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <img src="https://www.vietnamairlines.com/~/media/Images/VNANew/Home/Logo/logo_vna_menu.png" alt="VNA" className="h-6 opacity-80" />
                        <span className="font-bold text-vna-blue tracking-wider text-sm print:text-vna-text">BOARDING PASS</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 font-semibold uppercase">Booking Class</p>
                        <p className="font-bold">ECONOMY (Y)</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-xs text-slate-500 font-semibold uppercase">Name of Passenger</p>
                      <p className="text-xl font-bold">{p.fullName || p.name}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Flight</p>
                        <p className="text-lg font-bold">{booking.flightNo}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Date</p>
                        <p className="text-lg font-bold">{booking.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Booking Ref</p>
                        <p className="text-lg font-bold">{booking.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6 bg-slate-50 p-3 rounded-lg print:bg-white print:p-0 print:gap-8">
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 font-semibold uppercase">From</p>
                        <p className="text-2xl font-bold text-vna-blue print:text-vna-text">{booking.from}</p>
                      </div>
                      <PlaneTakeoff className="w-6 h-6 text-slate-300 print:text-vna-text" />
                      <div className="flex-1 text-right">
                        <p className="text-xs text-slate-500 font-semibold uppercase">To</p>
                        <p className="text-2xl font-bold text-vna-blue print:text-vna-text">{booking.to}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-3 rounded text-center print:bg-white print:border print:border-black">
                        <p className="text-xs text-slate-500 font-semibold uppercase">Gate</p>
                        <p className="text-2xl font-bold text-vna-blue print:text-vna-text">{booking.gate}</p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded text-center print:bg-white print:border print:border-black">
                        <p className="text-xs text-slate-500 font-semibold uppercase">Boarding Time</p>
                        <p className="text-2xl font-bold text-vna-gold print:text-vna-text">07:20</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded text-center print:bg-white print:border print:border-black">
                        <p className="text-xs text-slate-500 font-semibold uppercase">Seat</p>
                        <p className="text-2xl font-bold text-vna-blue print:text-vna-text">{p.seatNumber || p.seat || '---'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side (Stub) */}
                  <div className="w-full md:w-64 bg-slate-50 p-6 flex flex-col justify-between print:bg-white">
                    <div>
                       <div className="flex justify-between items-center mb-6">
                        <span className="font-bold text-vna-blue tracking-wider text-xs print:text-vna-text">BOARDING PASS</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-slate-500 font-semibold uppercase">Name</p>
                          <p className="font-bold line-clamp-1">{p.fullName || p.name}</p>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">Flight</p>
                            <p className="font-bold">{booking.flightNo}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">Seat</p>
                            <p className="font-bold">{p.seatNumber || p.seat || '---'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center bg-white p-2 rounded">
                      <QRCodeSVG value={`${booking.id}|${p.fullName || p.name}|${booking.flightNo}|${booking.date}|${booking.from}|${booking.to}|${p.seatNumber || p.seat || '---'}`} size={120} />
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}


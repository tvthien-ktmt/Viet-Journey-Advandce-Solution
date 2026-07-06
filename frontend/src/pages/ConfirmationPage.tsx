
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '@/api/booking';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2 } from 'lucide-react';
import { LotusLogo } from '@/components/common/LotusLogo';
import { formatVND } from '@/lib/formatters';
import { useLang } from '@/store/langStore';
import type { Flight, Passenger } from '@/types/flight';

export default function ConfirmationPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { t } = useLang();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingApi.get(bookingId!),
    enabled: !!bookingId,
  });

  if (isLoading) return <div className="text-center py-20">Đang tải...</div>;
  if (!booking) return null;

  if (booking.status !== 'CONFIRMED') {
    navigate('/');
    return null;
  }

  return (
    <div className="bg-vna-tint min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8 animate-in slide-in-from-bottom-4">
          <div className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4 shadow-sm border border-green-200">
            <CheckCircle2 className="text-green-600 w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-vna-text">{t('confirm.title')}</h1>
          <p className="text-vna-muted mt-2">{t('confirm.emailSent').replace('{email}', booking.contactEmail)}</p>
        </div>

        <Card className="p-6 border-2 border-vna-blue shadow-xl rounded-xl">
          <div className="flex items-center justify-between border-b border-vna-border pb-4">
            <div className="flex items-center gap-3">
              <LotusLogo className="w-10 h-10 text-vna-blue" />
              <div>
                <p className="font-bold text-vna-blue tracking-wider">VIETNAM AIRLINES</p>
                <p className="text-[10px] text-vna-muted font-bold tracking-widest">E-TICKET</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-vna-muted uppercase tracking-wider">Mã đặt chỗ</p>
              <p className="text-3xl font-bold text-vna-gold font-mono tracking-widest">{booking.bookingCode}</p>
            </div>
          </div>

          <div className="py-4 space-y-4">
            <FlightDetail flight={booking.outboundFlight} label={t('flight.outbound')} />
            {booking.returnFlight && (
              <>
                <Separator className="border-dashed" />
                <FlightDetail flight={booking.returnFlight} label={t('flight.return')} />
              </>
            )}
          </div>

          <Separator className="my-2" />
          
          <div className="py-4">
            <h4 className="font-bold text-vna-text mb-3 text-sm uppercase tracking-wider">{t('flight.passengers')}</h4>
            <div className="space-y-2">
              {booking.passengers.map((p, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="font-medium uppercase">{p.fullName}</span>
                  <span className="text-vna-muted">({t(`hold.passenger.${p.type}` as any)})</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-2 bg-vna-blue/20" />
          <div className="flex justify-between items-center font-bold text-vna-blue text-xl pt-4">
            <span>{t('confirm.paid')}</span>
            <span>{formatVND(booking.totalAmount)}</span>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Button variant="outline" className="border-vna-blue text-vna-blue hover:bg-vna-blue/5 rounded-lg transition-all duration-300" onClick={() => window.print()}>
            {t('confirm.downloadTicket')}
          </Button>
          <Button className="bg-vna-blue hover:bg-vna-blue-700 rounded-lg transition-all duration-300" onClick={() => navigate('/profile')}>
            {t('confirm.viewHistory')}
          </Button>
          <Button variant="ghost" className="text-vna-muted hover:text-vna-text rounded-lg transition-all duration-300" onClick={() => navigate('/')}>
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}

function FlightDetail({ flight, label }: { flight: Flight, label: string }) {
  return (
    <div>
      <Badge variant="outline" className="mb-3 text-vna-sky border-vna-sky">{label}</Badge>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{flight.departTime}</p>
          <p className="text-xs text-vna-muted mt-1">{flight.flightNo}</p>
        </div>
        <div className="flex-1 px-4 flex flex-col items-center">
          <p className="text-[10px] text-vna-muted">{flight.duration}</p>
          <div className="w-full h-px bg-vna-border relative my-2">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-vna-blue bg-white" />
          </div>
          <p className="text-[10px] text-vna-muted">{flight.aircraft}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{flight.arriveTime}</p>
          <p className="text-xs text-vna-muted mt-1 uppercase">{flight.cabin}</p>
        </div>
      </div>
    </div>
  );
}

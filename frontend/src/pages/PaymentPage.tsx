import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { bookingApi } from '@/api/booking';
import { Card, Button, Badge, Separator } from '@/components/ui';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatVND } from '@/lib/formatters';
import { useAuth } from '@/store/authStore';

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const _navigate = useNavigate();
  const { user } = useAuth();
  const [usePoints, setUsePoints] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(300);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingApi.get(bookingId!),
    enabled: !!bookingId,
  });

  // Polling hook
  useEffect(() => {
    let interval: any;
    let timeout: any;
    if (qrCodeUrl && countdown > 0 && !isSuccess) {
      interval = setInterval(async () => {
        try {
          const res = await bookingApi.getPaymentStatus(bookingId!);
          if (res.data?.status === 'SUCCESS') {
            setIsSuccess(true);
            toast.success('Thanh toán thành công!');
            timeout = setTimeout(() => {
               _navigate(`/payment/callback?vnp_ResponseCode=00&vnp_TxnRef=${booking?.id}`);
            }, 3000);
          } else if (res.data?.status === 'EXPIRED' || res.data?.status === 'LATE_PAYMENT') {
            setQrCodeUrl(null);
            setIsExpired(true);
            toast.error('Mã QR đã hết hạn. Nếu bạn chuyển khoản sau thời gian này sẽ không được ghi nhận.');
          }
        } catch {
          // ignore
        }
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [qrCodeUrl, countdown, bookingId, _navigate, booking?.id, isSuccess]);

  // Countdown hook
  useEffect(() => {
    let timer: any;
    if (qrCodeUrl && countdown > 0 && !isSuccess) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && qrCodeUrl && !isSuccess) {
      setQrCodeUrl(null);
      setIsExpired(true);
      toast.error('Mã QR đã hết hạn. Nếu bạn chuyển khoản sau thời gian này sẽ không được ghi nhận.');
    }
    return () => clearInterval(timer);
  }, [qrCodeUrl, countdown, isSuccess]);

  useEffect(() => {
    let timeout: any;
    if (booking?.bookingCode && !isSuccess) {
      const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080');
      socket.emit('join-booking', booking.bookingCode);
      socket.on('payment-success', () => {
         setIsSuccess(true);
         toast.success('Thanh toán thành công qua thiết bị khác!');
         timeout = setTimeout(() => {
            _navigate(`/payment/callback?vnp_ResponseCode=00&vnp_TxnRef=${booking.id}`);
         }, 3000);
      });
      return () => {
        socket.disconnect();
        if (timeout) clearTimeout(timeout);
      };
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [booking?.bookingCode, booking?.id, _navigate, isSuccess]);

  const createQrMutation = useMutation({
    mutationFn: () => bookingApi.createQRPayment(bookingId!),
    onSuccess: (data: any) => {
      if (data?.data?.qrCodeUrl) {
        setQrCodeUrl(data.data.qrCodeUrl);
        setCountdown(data.data.expiresIn || 300);
      } else {
        toast.error('Không thể tạo mã QR');
      }
    },
    onError: () => toast.error('Tạo mã QR thất bại')
  });

  const _payMutation = useMutation({
    mutationFn: () => bookingApi.payVnpay(bookingId!, usePoints),
    onSuccess: (data: { paymentUrl?: string }) => {
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error('Không nhận được URL thanh toán');
      }
    },
    onError: () => toast.error('Thanh toán thất bại')
  });

  if (isLoading) return <div className="text-center py-20">Đang tải...</div>;
  if (!booking) return null;

  if (booking.status !== 'RESERVED' && booking.status !== 'PENDING') {
    return <Navigate to="/" replace />; // Redirect if wrong status
  }

  const maxPoints = user?.lotusmilesMiles || 0;
  // 1 point = 1,000 VND discount
  const pointsDiscount = usePoints ? maxPoints * 1000 : 0;
  const finalPrice = Math.max(0, (booking.totalPrice || 0) - pointsDiscount);

  const snapshot = booking.itemSnapshot ? JSON.parse(booking.itemSnapshot) : null;

  return (
    <div className="bg-vna-tint min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold text-vna-text">Thanh toán</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <Card className="p-6 shadow-sm border-vna-border rounded-xl mb-6">
              <h3 className="font-bold text-vna-text mb-4 text-lg">Phương thức thanh toán</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 border-2 border-vna-blue rounded-xl p-4 cursor-pointer bg-vna-blue/5">
                  <input type="radio" checked readOnly className="text-vna-blue focus:ring-vna-blue rounded-lg" />
                  <div className="flex-1">
                    <p className="font-semibold text-vna-text">VietQR / VNPAY</p>
                    <p className="text-xs text-vna-muted">Mở App ngân hàng để quét mã QR</p>
                  </div>
                  <Badge className="bg-vna-blue text-white hover:bg-vna-blue transition-all duration-300">Được chọn</Badge>
                </label>
              </div>
            </Card>

            {isSuccess ? (
              <Card className="p-8 text-center shadow-sm border-green-200 bg-green-50 rounded-xl flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <CheckCircle2 className="text-green-500 w-24 h-24 mb-4 animate-bounce" />
                <h3 className="font-bold text-2xl text-green-700 mb-2">Thanh toán thành công!</h3>
                <p className="text-green-600 mb-6">Hệ thống đang chuyển hướng tới trang xác nhận...</p>
              </Card>
            ) : isExpired ? (
              <Card className="p-8 text-center shadow-sm border-red-200 bg-red-50 rounded-xl flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <span className="text-4xl">⏳</span>
                </div>
                <h3 className="font-bold text-2xl text-red-700 mb-2">Mã QR đã hết hạn</h3>
                <p className="text-red-600 mb-6 max-w-md">Khoản chuyển sau thời gian hiệu lực không được ghi nhận. Vui lòng liên hệ hỗ trợ nếu bạn đã chuyển tiền.</p>
                <Button 
                  size="lg" 
                  className="bg-vna-blue hover:bg-vna-blue/90" 
                  onClick={() => window.location.reload()}
                >
                  Tải lại trang để thử lại
                </Button>
              </Card>
            ) : qrCodeUrl ? (
              <Card className="p-8 text-center shadow-sm border-vna-border rounded-xl flex flex-col items-center">
                <h3 className="font-bold text-xl mb-2">Quét mã QR để thanh toán</h3>
                <p className="text-slate-500 mb-6 text-sm">Sử dụng ứng dụng ngân hàng hoặc ví điện tử</p>
                <div className="bg-white p-4 rounded-2xl shadow-inner border mb-6">
                  <img src={qrCodeUrl} alt="VietQR" className="w-64 h-64 object-contain" />
                </div>
                <div className="flex items-center gap-2 text-vna-red font-mono text-xl font-bold bg-vna-red/10 px-6 py-3 rounded-full">
                  <span>Mã hết hạn sau:</span>
                  <span>
                    {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-400">Hệ thống đang chờ thanh toán...</p>
              </Card>
            ) : (
              <div className="flex justify-center mt-8">
                <Button 
                  size="lg" 
                  className="w-full max-w-sm bg-vna-blue hover:bg-vna-blue/90" 
                  onClick={() => createQrMutation.mutate()}
                  disabled={createQrMutation.isPending}
                >
                  {createQrMutation.isPending ? 'Đang tạo...' : 'Tạo mã QR Thanh Toán'}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            <Card className="p-6 sticky top-24 shadow-md border-vna-border rounded-xl">
              <h3 className="font-bold text-vna-text mb-4 text-lg">Tóm tắt đơn hàng</h3>
              <div className="mb-4">
                <p className="text-xs text-vna-muted">Mã đặt chỗ</p>
                <p className="text-xl font-bold text-vna-gold font-mono">BK{booking.id}</p>
              </div>
              
              {snapshot && (
              <div className="bg-slate-50 p-3 rounded-lg border border-vna-border mb-4">
                <p className="font-semibold text-sm">{snapshot.from || snapshot.name} {snapshot.to ? `→ ${snapshot.to}` : ''}</p>
                <p className="text-xs text-vna-muted">{snapshot.departTime || snapshot.duration} - {snapshot.airline || booking.bookingType}</p>
              </div>
              )}

              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-vna-muted">Hành khách ({booking.passengers?.length ?? 0})</span>
                  <span>{formatVND(booking.totalPrice || 0)}</span>
                </div>
                
                {maxPoints > 0 && (
                  <div className="pt-2 mt-2 border-t border-vna-border">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="font-semibold text-vna-text block">Dùng dặm Lotusmiles</span>
                        <span className="text-xs text-vna-muted">Khả dụng: {maxPoints.toLocaleString()} dặm</span>
                      </div>
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-vna-gold cursor-pointer"
                        checked={usePoints}
                        onChange={(e) => setUsePoints(e.target.checked)}
                      />
                    </label>
                  </div>
                )}
                
                {usePoints && pointsDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Giảm giá (Lotusmiles)</span>
                    <span>-{formatVND(pointsDiscount)}</span>
                  </div>
                )}
                
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-vna-text">Tổng cộng</span>
                  <span className="text-vna-red">{formatVND(finalPrice)}</span>
                </div>
              </div>
              
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

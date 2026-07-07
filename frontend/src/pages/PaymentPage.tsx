
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { bookingApi } from '@/api/booking';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Separator } from '@/components/ui';
import { toast } from 'sonner';
import { formatVND } from '@/lib/formatters';

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingApi.get(bookingId!),
    enabled: !!bookingId,
  });

  const payMutation = useMutation({
    mutationFn: () => bookingApi.payVnpay(bookingId!),
    onSuccess: (data: { paymentUrl?: string }) => {
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error('Không nhận được URL thanh toán');
      }
    },
    onError: () => {
      toast.error('Thanh toán thất bại');
    }
  });

  if (isLoading) return <div className="text-center py-20">Đang tải...</div>;
  if (!booking) return null;

  if (booking.status !== 'RESERVED' && booking.status !== 'PENDING') {
    return <Navigate to="/" replace />; // Redirect if wrong status
  }

  const snapshot = booking.itemSnapshot ? JSON.parse(booking.itemSnapshot) : null;

  return (
    <div className="bg-vna-tint min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold text-vna-text">Thanh toán</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <Card className="p-6 shadow-sm border-vna-border rounded-xl">
              <h3 className="font-bold text-vna-text mb-4 text-lg">Phương thức thanh toán</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 border-2 border-vna-blue rounded-xl p-4 cursor-pointer bg-vna-blue/5">
                  <input type="radio" checked readOnly className="text-vna-blue focus:ring-vna-blue rounded-lg" />
                  <div className="flex-1">
                    <p className="font-semibold text-vna-text">VNPAY</p>
                    <p className="text-xs text-vna-muted">QR Pay, thẻ ATM nội địa, thẻ quốc tế</p>
                  </div>
                  <Badge className="bg-vna-blue text-white hover:bg-vna-blue transition-all duration-300">Được chọn</Badge>
                </label>
                <label className="flex items-center gap-3 border border-vna-border rounded-xl p-4 opacity-50 cursor-not-allowed">
                  <input type="radio" disabled />
                  <div>
                    <p className="font-semibold text-vna-text">Visa / Mastercard / JCB</p>
                    <p className="text-xs text-vna-muted">Sắp hỗ trợ</p>
                  </div>
                </label>
              </div>
            </Card>
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
                <div className="flex justify-between">
                  <span className="text-vna-muted">Phí dịch vụ</span>
                  <span>0 ₫</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-vna-text">Tổng cộng</span>
                  <span className="text-vna-red">{formatVND(booking.totalPrice || 0)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6 bg-vna-gold hover:bg-vna-gold-dark text-white py-6 text-lg font-bold shadow-lg rounded-lg transition-all duration-300"
                disabled={payMutation.isPending}
                onClick={() => payMutation.mutate()}
              >
                {payMutation.isPending ? 'Đang xử lý...' : 'Thanh toán ngay'}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/api/client';
import { toast } from 'sonner';

export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const _navigate = useNavigate();


  useEffect(() => {
    const processCallback = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        const response = await api.get<{ status: string }>('/payments/callback', { params });
        
        if (response?.status === 'completed') {
          toast.success('Thanh toán thành công!');
          _navigate(`/booking-history`);
        } else {
          toast.error('Thanh toán thất bại hoặc bị hủy.');
          _navigate('/payment-failed');
        }
      } catch (_e: any) {
        toast.error('Lỗi khi xử lý thanh toán.');
        _navigate('/payment-failed');
      }
    };
    
    processCallback();
  }, [searchParams, _navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Đang xử lý kết quả thanh toán...</h2>
        <div className="w-16 h-16 border-4 border-vna-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}

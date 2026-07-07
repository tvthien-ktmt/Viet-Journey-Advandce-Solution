import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { useNavigate, useParams } from 'react-router-dom';

export default function PaymentFailedPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-md w-full bg-white dark:bg-vna-blue-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-vna-red rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-vna-text dark:text-white mb-3">Thanh toán thất bại</h1>
        <p className="text-vna-muted dark:text-slate-400 mb-6 text-sm">
          Giao dịch thanh toán cho mã đặt chỗ <strong className="text-vna-text dark:text-white">{id || 'của bạn'}</strong> không thành công. Hệ thống vẫn giữ chỗ cho bạn trong vòng 10 phút.
        </p>

        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate(`/payment/${id}`)} className="bg-vna-blue hover:bg-vna-blue-700 transition-all duration-300">
            Thử thanh toán lại
          </Button>
          <Button variant="default" onClick={() => navigate('/')} className="text-vna-muted dark:text-slate-400 hover:text-vna-blue transition-all duration-300">
            Hủy và về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}


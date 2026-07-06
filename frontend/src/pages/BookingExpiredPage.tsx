import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';

export default function BookingExpiredPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-md w-full bg-white dark:bg-vna-blue-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800">
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-vna-gold rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-vna-text dark:text-white mb-3">Hết thời gian giữ chỗ</h1>
        <p className="text-vna-muted dark:text-slate-400 mb-6 text-sm">
          Đã quá 10 phút, mã đặt chỗ <strong className="text-vna-text dark:text-white">{id || 'của bạn'}</strong> đã bị hủy do chưa hoàn tất thanh toán. Vui lòng thực hiện tìm kiếm lại.
        </p>

        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate('/')} className="bg-vna-blue hover:bg-vna-blue-700 transition-all duration-300">
            Tìm chuyến bay mới
          </Button>
          <Button variant="ghost" onClick={() => navigate('/contact')} className="text-vna-blue dark:text-vna-gold">
            Liên hệ hỗ trợ
          </Button>
        </div>
      </div>
    </div>
  );
}

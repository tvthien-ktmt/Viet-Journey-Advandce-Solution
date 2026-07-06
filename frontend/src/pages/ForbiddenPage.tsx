import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/authStore';

export default function ForbiddenPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuth((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4 bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-vna-blue-900 p-8 md:p-12 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 dark:border-slate-800">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-vna-red rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={40} />
        </div>
        
        <h1 className="text-3xl font-bold text-vna-text dark:text-white mb-2">403</h1>
        <h2 className="text-xl font-bold text-vna-text dark:text-white mb-4">Truy cập bị từ chối</h2>
        
        {isAuthenticated() ? (
          <p className="text-vna-muted dark:text-slate-400 mb-8 text-sm">
            Tài khoản của bạn không có đủ quyền hạn để truy cập vào trang này. Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ quản trị viên.
          </p>
        ) : (
          <p className="text-vna-muted dark:text-slate-400 mb-8 text-sm">
            Bạn cần đăng nhập để truy cập vào trang này. Vui lòng đăng nhập với tài khoản hợp lệ.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {!isAuthenticated() && (
            <Button onClick={() => navigate('/login')} className="bg-vna-blue hover:bg-vna-blue-700 transition-all duration-300">
              Đăng nhập ngay
            </Button>
          )}
          <Button onClick={() => navigate('/')} variant={isAuthenticated() ? 'default' : 'outline'} className={isAuthenticated() ? 'bg-vna-blue hover:bg-vna-blue-700' : 'dark:text-white dark:border-slate-600'}>
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}

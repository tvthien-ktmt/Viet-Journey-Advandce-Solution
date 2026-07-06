import { ServerCrash } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ServerErrorPage() {
  const errorId = `ERR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-md w-full">
        <ServerCrash size={64} className="text-vna-red mx-auto mb-6 opacity-80" />
        <h1 className="text-5xl font-black text-vna-text dark:text-white mb-4">500</h1>
        <h2 className="text-2xl font-bold text-vna-text dark:text-white mb-4">Hệ thống gặp sự cố</h2>
        <p className="text-vna-muted dark:text-slate-400 mb-2">
          Rất xin lỗi, máy chủ của chúng tôi đang gặp sự cố. Chúng tôi đã ghi nhận và đang nỗ lực khắc phục.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mb-8 bg-slate-100 dark:bg-slate-800 inline-block px-3 py-1 rounded">
          Error ID: {errorId}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => window.location.reload()} className="bg-vna-blue hover:bg-vna-blue-700 transition-all duration-300">
            Tải lại trang
          </Button>
          <Button variant="outline" onClick={() => window.location.href = `mailto:support@vietjourney.com?subject=Bao loi ${errorId}`} className="dark:text-white dark:border-slate-600">
            Báo cáo lỗi
          </Button>
        </div>
      </div>
    </div>
  );
}

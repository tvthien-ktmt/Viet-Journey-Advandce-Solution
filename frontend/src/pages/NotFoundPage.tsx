import { LotusLogo } from '@/components/common/LotusLogo';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-white dark:bg-vna-blue-900">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <LotusLogo className="w-[800px] h-[800px] text-vna-blue dark:text-vna-gold" />
      </div>

      <div className="relative z-10 max-w-lg w-full">
        <h1 className="text-8xl font-black text-vna-gold mb-4 tracking-tighter">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-vna-text dark:text-white mb-4">Trang không tìm thấy</h2>
        <p className="text-vna-muted dark:text-slate-300 mb-8">
          Xin lỗi, đường dẫn bạn đang truy cập không tồn tại hoặc đã bị gỡ bỏ.
        </p>

        <div className="flex bg-white dark:bg-slate-800 rounded-full border border-vna-border p-1 shadow-sm max-w-sm mx-auto mb-8">
          <Input 
            placeholder="Tìm kiếm..." 
            className="border-none shadow-none focus-visible:ring-0 bg-transparent flex-1 dark:text-white rounded-lg"
          />
          <Button size="default" className="flex items-center gap-2 bg-vna-blue hover:bg-vna-blue-700 text-white shrink-0 rounded-lg transition-all duration-300">
            <Search size={18} />
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={() => window.location.href = '/'} className="bg-vna-blue hover:bg-vna-blue-700 transition-all duration-300">Về trang chủ</Button>
          <Button variant="outline" onClick={() => window.location.href = '/#destinations'} className="dark:text-white dark:border-slate-600">Khám phá điểm đến</Button>
          <Button variant="default" onClick={() => window.location.href = '/contact'} className="text-vna-blue dark:text-vna-gold hover:bg-vna-tint dark:hover:bg-slate-800 transition-all duration-300">Liên hệ hỗ trợ</Button>
        </div>
      </div>
    </div>
  );
}

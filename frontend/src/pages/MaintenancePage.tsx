import { Wrench } from 'lucide-react';
import { LotusLogo } from '@/components/common/LotusLogo';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-vna-blue text-white">
      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8 backdrop-blur">
        <Wrench size={40} className="text-vna-gold" />
      </div>
      
      <LotusLogo className="w-16 h-16 text-vna-gold mb-6" />
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Hệ thống đang bảo trì</h1>
      <p className="text-white/80 max-w-lg mx-auto mb-8 leading-relaxed">
        Vietnam Airlines đang tiến hành nâng cấp hệ thống để mang đến trải nghiệm tốt hơn cho quý khách. 
        Dự kiến hệ thống sẽ hoạt động bình thường trở lại trong khoảng <strong className="text-vna-gold">2 tiếng</strong> tới.
      </p>

      <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 w-full max-w-sm">
        <p className="text-sm text-white/70 mb-2 uppercase tracking-wider font-semibold">Liên hệ hỗ trợ gấp</p>
        <p className="text-2xl font-bold text-vna-gold mb-1">1900 1100</p>
        <p className="text-sm">support@vietnamairlines.com</p>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low w-full border-t border-outline-variant mt-12 pb-16 md:pb-0">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
        <div className="flex flex-col gap-4">
          <Link to="/" className="text-xl font-bold text-primary">VietJourney</Link>
          <p className="text-onSurface-variant text-sm">
            Mang đến những trải nghiệm du lịch tuyệt vời nhất tại Việt Nam với dịch vụ chuẩn quốc tế.
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-primary text-base">Khám phá</h4>
          <nav className="flex flex-col gap-2">
            <Link to="/destinations" className="text-onSurface-variant text-sm transition-all duration-300 hover:text-secondary hover:underline hover:opacity-80">Điểm đến</Link>
            <Link to="/tours" className="text-onSurface-variant text-sm transition-all duration-300 hover:text-secondary hover:underline hover:opacity-80">Dịch vụ</Link>
          </nav>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-primary text-base">Hỗ trợ</h4>
          <nav className="flex flex-col gap-2">
            <Link to="/contact" className="text-onSurface-variant text-sm transition-all duration-300 hover:text-secondary hover:underline hover:opacity-80">Hỗ trợ</Link>
            <Link to="/contact" className="text-onSurface-variant text-sm transition-all duration-300 hover:text-secondary hover:underline hover:opacity-80">Liên hệ</Link>
          </nav>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-primary text-base">Pháp lý</h4>
          <nav className="flex flex-col gap-2">
            <Link to="/terms" className="text-onSurface-variant text-sm transition-all duration-300 hover:text-secondary hover:underline hover:opacity-80">Điều khoản</Link>
            <Link to="/privacy" className="text-onSurface-variant text-sm transition-all duration-300 hover:text-secondary hover:underline hover:opacity-80">Bảo mật</Link>
          </nav>
        </div>
      </div>
      <div className="border-t border-outline-variant/30 py-4 text-center text-onSurface-variant text-sm">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          © 2024 VietJourney. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

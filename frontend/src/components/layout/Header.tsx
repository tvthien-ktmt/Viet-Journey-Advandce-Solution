
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { useState, useEffect } from 'react';

export default function Header() {
  const location = useLocation();
  const user = useAuth((s) => s.user);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const logout = useAuth((s) => s.logout);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Địa điểm', path: '/destinations' },
    { name: 'Tour', path: '/tours' },
    { name: 'Khách sạn', path: '/hotels' },
    { name: 'Vé máy bay', path: '/flights' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <>
      <header className={`bg-surface w-full sticky top-0 z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex justify-between items-center h-20">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2 transition-opacity duration-300 hover:opacity-80">
            VietJourney
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors duration-300 ${
                    isActive
                      ? 'text-primary font-bold border-b-2 border-primary pb-1'
                      : 'text-onSurface-variant font-normal hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <button className="p-2 rounded-full text-onSurface-variant transition-all duration-300 hover:bg-primary-light" aria-label="Language">
                <span className="material-symbols-outlined">language</span>
              </button>
              <button className="p-2 rounded-full text-onSurface-variant transition-all duration-300 hover:bg-primary-light" aria-label="Tìm kiếm">
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-sm font-medium text-primary hover:underline hidden sm:block transition-all duration-300">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors">
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
            
            <button 
              className="p-2 text-onSurface-variant block md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation (Bottom Bar) */}
      <nav className="block md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-surface-container-highest z-50">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${location.pathname === '/' ? 'text-primary' : 'text-onSurface-variant hover:text-primary'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
            <span className="text-[12px] mt-1 font-medium">Trang chủ</span>
          </Link>
          <Link to="/destinations" className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${location.pathname === '/destinations' ? 'text-primary' : 'text-onSurface-variant hover:text-primary'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/destinations' ? "'FILL' 1" : "'FILL' 0" }}>explore</span>
            <span className="text-[12px] mt-1 font-medium">Địa điểm</span>
          </Link>
          <Link to="/tours" className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${location.pathname === '/tours' ? 'text-primary' : 'text-onSurface-variant hover:text-primary'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/tours' ? "'FILL' 1" : "'FILL' 0" }}>tour</span>
            <span className="text-[12px] mt-1 font-medium">Tour</span>
          </Link>
          <Link to="/hotels" className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${location.pathname === '/hotels' ? 'text-primary' : 'text-onSurface-variant hover:text-primary'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/hotels' ? "'FILL' 1" : "'FILL' 0" }}>hotel</span>
            <span className="text-[12px] mt-1 font-medium">Khách sạn</span>
          </Link>
          <Link to="/flights" className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${location.pathname === '/flights' ? 'text-primary' : 'text-onSurface-variant hover:text-primary'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/flights' ? "'FILL' 1" : "'FILL' 0" }}>flight</span>
            <span className="text-[12px] mt-1 font-medium">Vé máy bay</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

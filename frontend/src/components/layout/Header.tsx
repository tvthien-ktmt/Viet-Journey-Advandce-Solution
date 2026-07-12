
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useLang } from '../../store/langStore';
import { useState, useEffect } from 'react';
import { GlobalSearch } from './GlobalSearch';

export default function Header() {
  const _location = useLocation();
  const user = useAuth((s) => s.user);
  const _isAuthenticated = useAuth((s) => s.isAuthenticated);
  const logout = useAuth((s) => s.logout);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { lang, setLang } = useLang();
  
  const { unreadCount, notifications, fetchNotifications, initSocket, disconnectSocket, markAsRead } = useNotificationStore();

  useEffect(() => {
    if (user && user.id) {
      fetchNotifications();
      initSocket(String(user.id));
    } else {
      disconnectSocket();
    }
  }, [user, fetchNotifications, initSocket, disconnectSocket]);

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
              const isActive = _location.pathname === link.path;
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
              <button 
                className="p-2 rounded-full text-onSurface-variant transition-all duration-300 hover:bg-primary-light flex items-center font-bold text-sm uppercase" 
                aria-label="Language"
                onClick={() => setLang(lang === 'vn' ? 'en' : 'vn')}
              >
                {lang}
              </button>
              <button 
                className="p-2 rounded-full text-onSurface-variant transition-all duration-300 hover:bg-primary-light" 
                aria-label="Tìm kiếm"
                onClick={() => setIsSearchOpen(true)}
              >
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <div className="relative">
                    <button 
                      onClick={() => setIsNotifOpen(!isNotifOpen)}
                      className="p-2 rounded-full text-onSurface-variant transition-all duration-300 hover:bg-primary-light relative mr-2"
                      aria-label="Thông báo"
                    >
                      <span className="material-symbols-outlined">notifications</span>
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {isNotifOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-surface rounded-xl shadow-lg border border-surface-container-highest overflow-hidden z-50">
                        <div className="p-4 border-b border-surface-container-highest font-bold text-onSurface">Thông báo</div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-onSurface-variant text-sm">Không có thông báo nào</div>
                          ) : (
                            notifications.map(n => (
                              <div key={n.id} 
                                className={`p-4 border-b border-surface-container-highest hover:bg-surface-container transition-colors cursor-pointer ${!n.isRead ? 'bg-primary-light/20' : ''}`}
                                onClick={() => { markAsRead(n.id); setIsNotifOpen(false); }}
                              >
                                <div className="font-semibold text-sm mb-1 text-onSurface">{n.title}</div>
                                <div className="text-xs text-onSurface-variant line-clamp-2">{n.message}</div>
                                <div className="text-[10px] text-onSurface-variant mt-2">{new Date(n.createdAt).toLocaleString('vi-VN')}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

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
        <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </header>

      {/* Mobile Navigation (Bottom Bar) */}
      <nav className="block md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-surface-container-highest z-50">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${_location.pathname === '/' ? 'text-primary' : 'text-onSurface-variant hover:text-primary'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: _location.pathname === '/' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
            <span className="text-[12px] mt-1 font-medium">Trang chủ</span>
          </Link>
          <Link to="/destinations" className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${_location.pathname === '/destinations' ? 'text-primary' : 'text-onSurface-variant hover:text-primary'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: _location.pathname === '/destinations' ? "'FILL' 1" : "'FILL' 0" }}>explore</span>
            <span className="text-[12px] mt-1 font-medium">Địa điểm</span>
          </Link>
          <Link to="/tours" className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${_location.pathname === '/tours' ? 'text-primary' : 'text-onSurface-variant hover:text-primary'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: _location.pathname === '/tours' ? "'FILL' 1" : "'FILL' 0" }}>tour</span>
            <span className="text-[12px] mt-1 font-medium">Tour</span>
          </Link>
          <Link to="/hotels" className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${_location.pathname === '/hotels' ? 'text-primary' : 'text-onSurface-variant hover:text-primary'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: _location.pathname === '/hotels' ? "'FILL' 1" : "'FILL' 0" }}>hotel</span>
            <span className="text-[12px] mt-1 font-medium">Khách sạn</span>
          </Link>
          <Link to="/flights" className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${_location.pathname === '/flights' ? 'text-primary' : 'text-onSurface-variant hover:text-primary'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: _location.pathname === '/flights' ? "'FILL' 1" : "'FILL' 0" }}>flight</span>
            <span className="text-[12px] mt-1 font-medium">Vé máy bay</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

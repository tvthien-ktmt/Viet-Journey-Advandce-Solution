
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plane, Ticket, Users, Newspaper, Menu, LogOut, Wallet, FileText, Map, Tag, MessageSquare } from 'lucide-react';
import { LotusLogo } from '@/components/common/LotusLogo';
import { useAuth } from '@/store/authStore';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui';
import { Avatar } from '@/components/ui';
import { Button } from '@/components/ui';

export default function AdminLayout() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin', end: true },
    { name: 'Chuyến bay', icon: Plane, path: '/admin/flights' },
    { name: 'Đặt chỗ', icon: Ticket, path: '/admin/bookings' },
    { name: 'Thanh toán', icon: Wallet, path: '/admin/payments' },
    { name: 'Người dùng', icon: Users, path: '/admin/users' },
    { name: 'Tin tức', icon: Newspaper, path: '/admin/news' },
    { name: 'Tour du lịch', icon: Map, path: '/admin/tours' },
    { name: 'Khuyến mãi', icon: Tag, path: '/admin/promotions' },
    { name: 'Phản hồi', icon: MessageSquare, path: '/admin/feedbacks' },
    { name: 'Nhật ký (Logs)', icon: FileText, path: '/admin/logs' },
  ];

  const NavLinks = () => (
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              isActive 
                ? 'bg-vna-gold text-vna-blue font-semibold' 
                : 'text-white hover:bg-white/10'
            }`
          }
        >
          <item.icon size={20} />
          {item.name}
        </NavLink>
      ))}
      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white hover:bg-white/10 hover:text-vna-red transition-colors text-left mt-auto">
        <LogOut size={20} />
        Đăng xuất
      </button>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-vna-tint">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-vna-blue text-white sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 p-6 border-b border-white/10">
          <LotusLogo className="w-8 h-8 text-white" />
          <span className="font-bold tracking-wide text-xl">VNA Admin</span>
        </div>
        <NavLinks />
      </aside>

      {/* Mobile Top Bar */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between md:hidden sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger className="md:hidden p-2 rounded-md hover:bg-slate-100 transition-all duration-300">
                <Menu className="w-6 h-6 text-vna-blue" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-vna-blue text-white border-none flex flex-col">
                <div className="flex items-center gap-3 p-6 border-b border-white/10">
                  <LotusLogo className="w-8 h-8 text-white" />
                  <span className="font-bold tracking-wide text-xl">VNA Admin</span>
                </div>
                <NavLinks />
              </SheetContent>
            </Sheet>
            <span className="font-bold text-vna-blue text-lg">VNA Admin</span>
          </div>
          <Avatar className="w-8 h-8 bg-vna-gold text-white flex items-center justify-center font-bold">
            {user?.fullName?.[0] || 'A'}
          </Avatar>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


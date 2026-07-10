import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { TopBar } from '@/components/layout/TopBar';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { useEffect, useState } from 'react';
import { useAuth } from '@/store/authStore';
import { GlobalSearch } from '@/components/common/GlobalSearch';
import { ChatWidget } from '@/components/common/ChatWidget';
import { BackToTop } from '@/components/common/BackToTop';

export function RootLayout() {
  const initAuth = useAuth(s => s.initAuth);
  const isInitialized = useAuth(s => s.isInitialized);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    document.addEventListener('open-global-search', handleOpenSearch);
    return () => document.removeEventListener('open-global-search', handleOpenSearch);
  }, []);

  if (!isInitialized) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="w-10 h-10 border-4 border-vna-blue border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <TopBar />
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <Toaster position="top-right" richColors closeButton />
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ChatWidget />
      <BackToTop />
    </div>
  );
}

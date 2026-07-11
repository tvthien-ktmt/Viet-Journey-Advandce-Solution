
import * as React from 'react';
import { Menu, Ticket, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui';
import { LotusLogo } from '@/components/common/LotusLogo';
import { LotusLoginButton } from '@/components/layout/TopBar';
import { useT } from '@/store/langStore';

export function SiteHeader() {
  const t = useT();
  const [open, setOpen] = React.useState(false);

  const navItems = [
    { id: 'book', label: t.header.nav.book, href: '#booking' },
    { id: 'manage', label: t.header.nav.manage, href: '#' },
    { id: 'checkin', label: t.header.nav.checkin, href: '#' },
    { id: 'status', label: t.header.nav.status, href: '#' },
    { id: 'discover', label: t.header.nav.discover, href: '#offers' },
    { id: 'destinations', label: t.header.nav.destinations, href: '#destinations' },
  ];

  return (
    <header className="sticky top-0 z-[70] border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3" aria-label="Vietnam Airlines — Home">
          <LotusLogo size={40} className="shrink-0" />
          <div className="leading-tight">
            <div className="vna-text-deep text-base font-extrabold tracking-[0.18em] uppercase sm:text-lg">
              VIETNAM AIRLINES
            </div>
            <div className="vna-text-gold text-[10px] font-medium tracking-wide sm:text-[11px]">
              {t.header.tagline}
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {navItems.map((it) => (
            <a key={it.id} href={it.href} className="vna-nav-underline text-sm font-medium text-[#0b1f3a] transition-colors hover:vna-text-deep">
              {it.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-[#0b1f3a] hover:bg-slate-100 hidden sm:flex"
            onClick={() => document.dispatchEvent(new CustomEvent('open-global-search'))}
            aria-label="Tìm kiếm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </Button>
          <a href="#booking" className="flex items-center gap-2 hidden bg-[#023a78] text-white hover:bg-vna-blue-800 sm:inline-flex rounded-md transition-all duration-300 h-9 px-3 text-xs font-medium">
            <Ticket className="size-4" />
            <span>{t.header.book}</span>
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="border-[#023a78]/30 text-[#023a78] lg:hidden p-2 rounded-md hover:bg-slate-100 transition-all duration-300" aria-label={t.header.menu}>
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </SheetTrigger>
            <SheetContent side="right" className="w-[82%] max-w-sm border-l-[#e1eaf4] p-0">
              <SheetHeader className="border-b border-slate-200 bg-[#023a78] p-4 text-white">
                <div className="flex items-center gap-3">
                  <LotusLogo size={36} />
                  <div>
                    <SheetTitle className="text-sm font-bold tracking-[0.16em] uppercase text-white">
                      Vietnam Airlines
                    </SheetTitle>
                    <p className="text-[11px] text-[#f5a623]">{t.header.tagline}</p>
                  </div>
                </div>
              </SheetHeader>

              <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
                {navItems.map((it) => (
                  <a
                    key={it.id}
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-[#0b1f3a] transition-colors hover:bg-[#eaf3fb] hover:text-[#023a78]"
                  >
                    {it.label}
                  </a>
                ))}
              </nav>

              <div className="mt-auto space-y-3 border-t border-slate-200 p-4">
                <a href="#booking" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 w-full bg-[#023a78] text-white hover:bg-vna-blue-800 rounded-md transition-all duration-300 h-10 font-medium">
                  <Ticket className="size-4" />
                  {t.header.book}
                </a>
                <LotusLoginButton variant="outline" fullWidth className="border-[#023a78]/30 text-[#023a78] hover:bg-[#eaf3fb] hover:text-[#023a78] transition-all duration-300" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}


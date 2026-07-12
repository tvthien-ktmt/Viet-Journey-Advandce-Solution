
import * as React from 'react';
import { Phone, Plane, UserRound, Globe } from 'lucide-react';
import { Button } from '@/components/ui';

import { useLang, useT, type Lang } from '@/store/langStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeSettings } from '@/components/common/ThemeSettings';
import { CurrencySwitcher } from '@/components/common/CurrencySwitcher';

export function LotusLoginButton({
  className,
  variant = 'ghost',
  fullWidth,
}: {
  className?: string;
  variant?: 'ghost' | 'default' | 'outline' | 'secondary';
  fullWidth?: boolean;
}) {
  const _t = useT();
  const _navigate = useNavigate();

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={() => _navigate('/login')}
      className={cn(
        'flex items-center gap-2',
        'gap-1.5 text-white hover:bg-white/10 hover:text-white',
        fullWidth && 'w-full',
        className,
      )}
    >
      <UserRound className="size-3.5" />
      <span>{_t.topbar.login}</span>
    </Button>
  );
}

function LangToggle() {
  const _lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  const options: { id: Lang; label: string }[] = [
    { id: 'vn', label: 'VN' },
    { id: 'en', label: 'EN' },
  ];
  return (
    <div className="inline-flex items-center rounded-full border border-white/20 p-0.5 text-xs font-semibold" role="group" aria-label="Language">
      <Globe className="mr-1 ml-1.5 size-3.5 text-white/70" />
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => setLang(o.id)}
          className={cn(
            'rounded-full px-2.5 py-1 transition-colors',
            _lang === o.id ? 'bg-[#f5a623] text-[#023a78]' : 'text-white/80 hover:text-white',
          )}
          aria-pressed={_lang === o.id}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function TopBar() {
  const _t = useT();
  return (
    <div className="bg-[#023a78] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 text-xs sm:px-6">
        <div className="flex items-center gap-2">
          <LangToggle />
          <CurrencySwitcher />
        </div>
        <div className="flex items-center gap-1 sm:gap-3">
          <ThemeSettings />
          <button type="button" className="hidden items-center gap-1.5 text-white/85 transition-colors hover:text-[#f5a623] sm:inline-flex">
            <Phone className="size-3.5" />
            <span>{_t.topbar.contact}</span>
          </button>
          <button type="button" className="hidden items-center gap-1.5 text-white/85 transition-colors hover:text-[#f5a623] sm:inline-flex">
            <Plane className="size-3.5" />
            <span>{_t.topbar.flightStatus}</span>
          </button>
          <button type="button" className="flex items-center gap-2 text-white/85 transition-colors hover:text-[#f5a623] sm:hidden" aria-label={_t.topbar.contact}>
            <Phone className="size-4" />
          </button>
          <button type="button" className="flex items-center gap-2 text-white/85 transition-colors hover:text-[#f5a623] sm:hidden" aria-label={_t.topbar.flightStatus}>
            <Plane className="size-4" />
          </button>
          <span className="hidden h-3 w-px bg-white/25 sm:inline-block" aria-hidden />
          <span className="hidden text-white/70 sm:inline">{_t.topbar.lotusmiles}</span>
          <LotusLoginButton />
        </div>
      </div>
    </div>
  );
}


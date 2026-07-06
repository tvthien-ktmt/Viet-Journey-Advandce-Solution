
import { Star, Award, Gem, Crown, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { lotusTiers } from '@/data/vna-data';
import { useT } from '@/store/langStore';
import { toast } from 'sonner';
import { LotusLogo } from '@/components/common/LotusLogo';
import { cn } from '@/lib/utils';

const tierIcons = [Star, Award, Gem, Crown];

export function LotusmilesSection() {
  const t = useT();

  return (
    <section id="lotusmiles" className="relative overflow-hidden bg-[#023a78] py-14 text-white sm:py-20">
      <div className="pointer-events-none absolute -right-16 -top-16 opacity-[0.06]">
        <LotusLogo size={360} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#f5a623]">
              <LotusLogo size={16} /> LOTUSMILES
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t.sections.lotusmiles}</h2>
            <p className="mt-1 max-w-xl text-sm text-white/80">{t.sections.lotusmilesSub}</p>
          </div>
          <Button
            type="button"
            className="flex items-center gap-2 bg-[#f5a623] text-[#023a78] hover:bg-vna-gold rounded-lg transition-all duration-300"
            onClick={() => toast.success(t.sections.joinNow, { description: t.login.subtitle })}
          >
            {t.sections.joinNow}
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {lotusTiers.map((tier, i) => {
            const Icon = tierIcons[i] ?? Star;
            const isTop = i >= 2;
            return (
              <div
                key={tier.name}
                className={cn(
                  'relative flex flex-col rounded-2xl border bg-white/5 p-5 backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/10',
                  isTop ? 'border-[#f5a623]/50 ring-1 ring-[#f5a623]/20' : 'border-white/15',
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className={cn('inline-flex size-11 items-center justify-center rounded-full', isTop ? 'bg-[#f5a623] text-[#023a78]' : 'bg-white/10 text-white')}>
                    <Icon className="size-5" />
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-white/60">Tier {i + 1}</span>
                </div>
                <h3 className={cn('text-lg font-bold', isTop ? 'text-[#f5a623]' : 'text-white')}>{tier.name}</h3>
                <div className="mb-3 text-[11px] text-white/70">{tier.threshold}</div>
                <ul className="space-y-2">
                  {tier.perks.map((p) => (
                    <li key={p} className="flex gap-2 text-xs text-white/85">
                      <Check className={cn('mt-0.5 size-3.5 shrink-0', isTop ? 'text-[#f5a623]' : 'text-[#1f6fb2]')} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

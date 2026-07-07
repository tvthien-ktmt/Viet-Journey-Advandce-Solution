import * as React from 'react';
import { ArrowLeftRight, Plane, Search, Users, Minus, Plus, CalendarDays, MapPin, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui';
import { Badge } from '@/components/ui';
import { useT } from '@/store/langStore';
import { toast } from 'sonner';
import { airports, IMAGES } from '@/data/vna-data';
import { searchFlights } from '@/api/flights';
import type { CabinId, FlightSearchRequest, FlightSearchResponse, TripType } from '@/types/flight';
import { FlightResults } from '@/components/home/FlightResults';
import { cn } from '@/lib/utils';
import { todayStr, addDaysStr } from '@/lib/formatters';

const cabinOptions: { id: CabinId; key: 'cabinEconomy' | 'cabinEconomySpecial' | 'cabinBusiness' | 'cabinPremium' }[] = [
  { id: 'economy', key: 'cabinEconomy' },
  { id: 'premium', key: 'cabinEconomySpecial' },
  { id: 'business', key: 'cabinBusiness' },
  { id: 'premiumBusiness', key: 'cabinPremium' },
];

function Stepper({
  label, hint, value, onChange, min = 0, max = 9,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div>
        <div className="text-sm font-medium text-[#0b1f3a]">{label}</div>
        <div className="text-[11px] text-slate-500">{hint}</div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="icon" className="flex items-center gap-2 size-8 border-[#1f6fb2]/40 text-[#023a78] rounded-lg" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Decrease ${label}`}>
          <Minus className="size-3.5" />
        </Button>
        <span className="w-6 text-center text-sm font-semibold tabular-nums">{value}</span>
        <Button type="button" variant="outline" size="icon" className="flex items-center gap-2 size-8 border-[#1f6fb2]/40 text-[#023a78] rounded-lg" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Increase ${label}`}>
          <Plus className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

function FieldShell({
  label, icon, children, className,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </Label>
      {children}
    </div>
  );
}

export function HeroSearch() {
  const today = new Date().toISOString().split('T')[0];
  const t = useT();

  const [tripType, setTripType] = React.useState<TripType>('round');
  const [from, setFrom] = React.useState('HAN');
  const [to, setTo] = React.useState('SGN');
  const [departDate, setDepartDate] = React.useState(addDaysStr(todayStr(), 7));
  const [returnDate, setReturnDate] = React.useState(addDaysStr(todayStr(), 14));
  const [adults, setAdults] = React.useState(1);
  const [children, setChildren] = React.useState(0);
  const [infants, setInfants] = React.useState(0);
  const [cabin, setCabin] = React.useState<CabinId>('economy');
  const [promo, setPromo] = React.useState('');

  React.useEffect(() => {
    if (infants > adults) {
      setInfants(adults);
    }
  }, [adults, infants]);

  const [paxOpen, setPaxOpen] = React.useState(false);
  const [resultsOpen, setResultsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<FlightSearchResponse | null>(null);
  const [req, setReq] = React.useState<FlightSearchRequest | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const cabinLabel = React.useMemo(() => {
    const opt = cabinOptions.find((o) => o.id === cabin);
    return opt ? t.hero.book[opt.key] : '';
  }, [cabin, t]);

  const totalPax = adults + children + infants;
  const paxSummary = `${adults + children + infants} ${totalPax === 1 ? t.hero.book.adults.replace('s', '') : t.hero.book.adults} · ${cabinLabel}`;

  function swap() {
    setFrom(to);
    setTo(from);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!from || !to) { toast.error('Vui lòng chọn điểm đi và điểm đến'); return; }
    if (from === to) { toast.error('Điểm đi và điểm đến không được trùng nhau'); return; }
    if (!departDate) { toast.error('Vui lòng chọn ngày đi'); return; }
    if (tripType === 'round' && !returnDate) { toast.error('Vui lòng chọn ngày về cho chuyến khứ hồi'); return; }
    if (tripType === 'round' && returnDate < departDate) { toast.error('Ngày về phải sau ngày đi'); return; }

    const payload: FlightSearchRequest = {
      from, to, departDate,
      returnDate: tripType === 'round' ? returnDate : undefined,
      tripType, adults, children, infants, cabin,
      promoCode: promo.trim() || undefined,
    };

    setReq(payload);
    setLoading(true);
    setError(null);
    setData(null);
    setResultsOpen(true);

    try {
      const json = await searchFlights(payload);
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="booking" className="relative w-full overflow-hidden bg-[#023a78]">
      <img
        src={IMAGES.hero}
        alt="Vietnam Airlines — Bay cùng Việt Nam"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#023a78]/30 via-[#023a78]/55 to-[#023a78]/90" />

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col px-4 pb-40 pt-16 sm:px-6 sm:pb-44 sm:pt-20 lg:pb-52 lg:pt-24">
        <div className="max-w-2xl text-white">
          <Badge className="mb-4 border-[#f5a623]/40 bg-[#f5a623]/15 text-[#f5a623] hover:bg-[#f5a623]/20 transition-colors duration-200">
            ★ {t.header.tagline}
          </Badge>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight drop-shadow-md sm:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/85 sm:text-base">{t.hero.tagline}</p>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-32 max-w-7xl px-4 sm:-mt-36 sm:px-6 lg:-mt-40">
        <form onSubmit={onSubmit} className="rounded-2xl border border-white/40 bg-white p-4 shadow-2xl sm:p-6">
          <Tabs value={tripType} onValueChange={(v) => setTripType(v as TripType)} className="mb-4">
            <TabsList className="bg-[#eaf3fb]">
              <TabsTrigger value="round" className="data-[state=active]:bg-[#023a78] data-[state=active]:text-white">{t.hero.book.roundTrip}</TabsTrigger>
              <TabsTrigger value="oneway" className="data-[state=active]:bg-[#023a78] data-[state=active]:text-white">{t.hero.book.oneWay}</TabsTrigger>
              <TabsTrigger value="multi" className="data-[state=active]:bg-[#023a78] data-[state=active]:text-white">{t.hero.book.multiCity}</TabsTrigger>
            </TabsList>
          </Tabs>

          {tripType === 'multi' && (
            <div className="mb-4 rounded-md border border-[#f5a623]/40 bg-[#f5a623]/10 px-3 py-2 text-xs text-yellow-800">
              ℹ {t.hero.book.multiNote}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <FieldShell label={t.hero.book.from} icon={<MapPin className="size-3" />} className="md:col-span-3">
              <Select value={from} onValueChange={(v) => v && setFrom(v)}>
                <SelectTrigger className="h-11 w-full rounded-lg border-[#1f6fb2]/30 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectGroup>
                    <SelectLabel>Sân bay</SelectLabel>
                    {airports.map((a) => (
                      <SelectItem key={a.code} value={a.code}>
                        <span className="font-semibold text-[#023a78]">{a.code}</span> — {a.city} ({a.country})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FieldShell>

            <div className="hidden items-end justify-center md:col-span-1 md:flex">
              <button
                type="button"
                onClick={swap}
                className="mb-1 inline-flex size-11 items-center justify-center rounded-full border border-[#1f6fb2]/30 bg-[#eaf3fb] text-[#023a78] transition-all hover:rotate-180 hover:bg-[#1f6fb2] hover:text-white"
                aria-label="Swap"
              >
                <ArrowLeftRight className="size-4" />
              </button>
            </div>

            <FieldShell label={t.hero.book.to} icon={<MapPin className="size-3" />} className="md:col-span-3">
              <Select value={to} onValueChange={(v) => v && setTo(v)}>
                <SelectTrigger className="h-11 w-full rounded-lg border-[#1f6fb2]/30 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectGroup>
                    <SelectLabel>Sân bay</SelectLabel>
                    {airports.map((a) => (
                      <SelectItem key={a.code} value={a.code}>
                        <span className="font-semibold text-[#023a78]">{a.code}</span> — {a.city} ({a.country})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FieldShell>

            <FieldShell label={t.hero.book.depart} icon={<CalendarDays className="size-3" />} className="md:col-span-2">
              <Input type="date" value={departDate} min={today} onChange={(e) => setDepartDate(e.target.value)} className="h-11 rounded-lg border-[#1f6fb2]/30 bg-white" />
            </FieldShell>

            <FieldShell label={t.hero.book.return} icon={<CalendarDays className="size-3" />} className="md:col-span-3">
              <Input type="date" value={returnDate} min={departDate} disabled={tripType !== 'round'} onChange={(e) => setReturnDate(e.target.value)} className="h-11 rounded-lg border-[#1f6fb2]/30 bg-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60" />
            </FieldShell>

            <div className="flex items-end justify-center md:hidden">
              <button type="button" onClick={swap} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-[#1f6fb2]/30 bg-[#eaf3fb] text-[#023a78] text-sm font-medium" aria-label="Swap">
                <ArrowLeftRight className="size-4" />
                Đảo chiều
              </button>
            </div>

            <FieldShell label={`${t.hero.book.passengers} · ${t.hero.book.cabin}`} icon={<Users className="size-3" />} className="md:col-span-4">
              <Popover open={paxOpen} onOpenChange={setPaxOpen}>
                <PopoverTrigger type="button" className="flex h-11 w-full items-center justify-between rounded-lg border border-[#1f6fb2]/30 bg-white px-3 text-left text-sm transition-colors hover:border-[#1f6fb2]">
                  <span className="line-clamp-1 font-medium text-[#0b1f3a]">{paxSummary}</span>
                  <Users className="size-4 text-[#1f6fb2]" />
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3" align="start">
                  <div className="divide-y divide-slate-200">
                    <Stepper label={t.hero.book.adults} hint={t.hero.book.adultsHint} value={adults} onChange={setAdults} min={1} max={9} />
                    <Stepper label={t.hero.book.children} hint={t.hero.book.childrenHint} value={children} onChange={setChildren} max={9} />
                    <Stepper label={t.hero.book.infants} hint={t.hero.book.infantsHint} value={infants} onChange={setInfants} max={adults} />
                  </div>
                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <Label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">{t.hero.book.cabin}</Label>
                    <Select value={cabin} onValueChange={(v) => v && setCabin(v as CabinId)}>
                      <SelectTrigger className="w-full border-[#1f6fb2]/30 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cabinOptions.map((o) => (
                          <SelectItem key={o.id} value={o.id}>{t.hero.book[o.key]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" className="mt-3 w-full bg-[#023a78] hover:bg-[#022f60] rounded-lg transition-colors duration-200" onClick={() => setPaxOpen(false)}>OK</Button>
                </PopoverContent>
              </Popover>
            </FieldShell>

            <FieldShell label={t.hero.book.promo} icon={<Tag className="size-3" />} className="md:col-span-5">
              <Input type="text" placeholder={t.hero.book.promoPlaceholder} className="h-11 rounded-lg border-[#1f6fb2]/30 bg-white placeholder:text-slate-400" />
            </FieldShell>

            <div className="flex items-end md:col-span-3">
              <Button type="submit" size="lg" disabled={loading} className="flex items-center gap-2 h-11 w-full rounded-lg bg-[#023a78] text-white transition-colors hover:bg-[#f5a623] hover:text-[#023a78] disabled:opacity-60">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                {t.hero.book.search}
              </Button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Plane className="size-3 text-[#1f6fb2]" />
              {airports.length}+ sân bay · 60+ điểm đến
            </span>
            <span className="inline-flex items-center gap-1">
              <Tag className="size-3 text-[#1f6fb2]" />
              {t.hero.book.promo}: VNA2025
            </span>
          </div>
        </form>
      </div>

      <FlightResults
        open={resultsOpen}
        onOpenChange={setResultsOpen}
        loading={loading}
        data={data}
        request={req}
        error={error}
      />
    </section>
  );
}


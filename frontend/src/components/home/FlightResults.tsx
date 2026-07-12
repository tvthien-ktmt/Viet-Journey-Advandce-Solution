import * as React from 'react';
import { Plane, Clock, Users, ArrowRight, Loader2, CheckCircle2, Luggage } from 'lucide-react';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { Skeleton } from '@/components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui';
import { useT } from '@/store/langStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/authStore';
import { formatVND } from '@/lib/formatters';
import type { FlightSearchRequest, FlightSearchResponse, Flight as MockFlight } from '@/types/flight';

type DisplayFlight = MockFlight & { fromCode: string; toCode: string };

interface FlightResultsProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  loading: boolean;
  data: FlightSearchResponse | null;
  request: FlightSearchRequest | null;
  error: string | null;
}

const FlightRow = React.memo(function FlightRow({
  flight, selected, onSelect, cabinLabel,
}: {
  flight: DisplayFlight;
  selected: boolean;
  onSelect: () => void;
  cabinLabel: string;
}) {
  const _t = useT();
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 transition-all sm:grid-cols-[1fr_1fr_auto] sm:items-center',
        selected ? 'border-[#f5a623] ring-2 ring-[#f5a623]/30' : 'border-slate-200 hover:border-[#1f6fb2]/50 hover:shadow-sm',
      )}
    >
      <div className="flex items-center gap-3">
        <div className="text-center">
          <div className="text-lg font-bold text-[#023a78]">{flight.departTime}</div>
          <div className="text-xs font-medium text-slate-500">{flight.fromCode}</div>
        </div>
        <div className="flex flex-1 flex-col items-center">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Clock className="size-3" />
            {flight.duration}
          </div>
          <div className="relative my-1 h-px w-full bg-slate-200">
            <Plane className="absolute -top-1.5 left-1/2 size-3.5 -translate-x-1/2 rotate-90 text-[#1f6fb2]" />
          </div>
          <div className="text-[11px] text-slate-500">
            {flight.stops === 0 ? _t.results.nonstop : `${flight.stops} ${_t.results.stops}`}
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[#023a78]">
            {flight.arriveTime}
            {flight.nextDay && (
              <span className="ml-0.5 align-top text-[10px] font-semibold text-[#d4111a]">+1</span>
            )}
          </div>
          <div className="text-xs font-medium text-slate-500">{flight.toCode}</div>
        </div>
      </div>

      <div className="flex flex-col gap-1 border-t border-dashed border-slate-200 pt-3 text-xs text-slate-600 sm:border-t-0 sm:pl-4 sm:pt-0">
        <div className="font-semibold text-[#023a78]">{flight.flightNo}</div>
        <div>{flight.aircraft}</div>
        <div className="flex items-center gap-1">
          <Luggage className="size-3" />
          {cabinLabel}
        </div>
      </div>

      <div className="flex flex-row items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
        <div className="text-right">
          <div className="text-lg font-bold text-[#d4111a]">{formatVND(flight.priceVND)}</div>
          <div className="text-[11px] text-slate-500">{flight.seatsLeft} {_t.results.seatsLeft}</div>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={onSelect}
          variant={selected ? 'secondary' : 'default'}
          className={cn(
            'shrink-0',
            selected ? 'bg-[#eaf3fb] text-[#023a78] hover:bg-slate-200' : 'bg-[#023a78] hover:bg-[#022f60]',
          )}
        >
          {selected ? (
            <>
              <CheckCircle2 className="size-4" />
              {_t.results.selected}
            </>
          ) : (
            _t.results.select
          )}
        </Button>
      </div>
    </div>
  );
});

export function FlightResults({
  open, onOpenChange, loading, data, request, error,
}: FlightResultsProps) {
  const _t = useT();
  const _navigate = useNavigate();
  const _location = useLocation();
  const _isAuthenticated = useAuth((s) => s.isAuthenticated);
  const [activeTab, setActiveTab] = React.useState<string>('outbound');
  const [outbound, setOutbound] = React.useState<DisplayFlight | null>(null);
  const [ret, setRet] = React.useState<DisplayFlight | null>(null);

  React.useEffect(() => {
    if (open) {
      setActiveTab('outbound');
      setOutbound(null);
      setRet(null);
    }
  }, [open]);

  const handleSelectOutbound = React.useCallback((f: DisplayFlight) => setOutbound(f), []);
  const handleSelectRet = React.useCallback((f: DisplayFlight) => setRet(f), []);

  const isRound = request?.tripType === 'round';

  const cabinLabel =
    request?.cabin === 'business' ? _t.hero.book.cabinBusiness
      : request?.cabin === 'premium' ? _t.hero.book.cabinEconomySpecial
        : request?.cabin === 'premiumBusiness' ? _t.hero.book.cabinPremium
          : _t.hero.book.cabinEconomy;

  const totalPax = (request?.adults ?? 0) + (request?.children ?? 0) + (request?.infants ?? 0);

  const outFlights: DisplayFlight[] = React.useMemo(
    () => (data?.outbound ?? []).map((f, i) => ({ ...f, fromCode: data!.request.from, toCode: data!.request.to, id: f.id || `out-${i}` })),
    [data],
  );
  const retFlights: DisplayFlight[] = React.useMemo(
    () => (data?.return ?? []).map((f, i) => ({ ...f, fromCode: data!.request.to, toCode: data!.request.from, id: f.id || `ret-${i}` })),
    [data],
  );

  const total = (outbound ? outbound.priceVND : 0) + (ret ? ret.priceVND : 0);
  const canContinue = !!outbound && (!isRound || !!ret) && totalPax > 0;

  function onContinue() {
    if (!_isAuthenticated()) {
      _navigate('/login', { state: { from: _location } });
      toast.info('Vui lòng đăng nhập để tiếp tục đặt vé');
      return;
    }

    toast.success(_t.results.bookingToast, {
      description: `${request?.from} → ${request?.to}${isRound && _t.results.return ? ` (${_t.results.return.toLowerCase()})` : ''} · ${cabinLabel}`,
    });
    onOpenChange(false);
    _navigate('/booking/hold', {
      state: {
        request,
        outbound,
        return: ret,
        totalPrice: total * Math.max(totalPax, 1)
      }
    });
  }

  const headerText = request ? `${request.from} → ${request.to}` : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-4xl rounded-2xl">
        <DialogHeader className="border-b border-slate-200 bg-[#023a78] p-4 text-white">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <DialogTitle className="flex items-center gap-2 text-base text-white">
                <Plane className="size-4 text-[#f5a623]" />
                {headerText}
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-xs text-white/80">
                {request?.departDate}
                {isRound && request?.returnDate ? ` — ${request.returnDate}` : ''} ·{' '}
                <Users className="mr-0.5 inline size-3" />
                {totalPax} · {cabinLabel}
              </DialogDescription>
            </div>
            <Badge className="bg-[#f5a623] text-[#023a78] hover:bg-[#f5a623] transition-all duration-300">
              {(data?.outbound?.length ?? 0) + (data?.return?.length ?? 0)} {_t.results.flightsFound}
            </Badge>
          </div>
        </DialogHeader>

        <div className="vna-scroll max-h-[60vh] overflow-y-auto bg-slate-50 p-4">
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-28" />
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center gap-2 py-2 text-sm text-[#023a78]">
                <Loader2 className="size-4 animate-spin" />
                {_t.results.loading}
              </div>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">{error}</div>
          ) : data && data.outbound.length === 0 && (data.return?.length ?? 0) === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">{_t.results.empty}</div>
          ) : isRound ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-3 grid w-full grid-cols-1 md:grid-cols-2 bg-[#eaf3fb]">
                <TabsTrigger value="outbound" className="data-[state=active]:bg-white">{_t.results.outbound}</TabsTrigger>
                <TabsTrigger value="return" className="data-[state=active]:bg-white">{_t.results.return}</TabsTrigger>
              </TabsList>
              <TabsContent value="outbound" className="space-y-3">
                {outFlights.map((f) => (
                  <FlightRow key={f.id} flight={f} cabinLabel={cabinLabel} selected={outbound?.id === f.id} onSelect={() => handleSelectOutbound(f)} />
                ))}
              </TabsContent>
              <TabsContent value="return" className="space-y-3">
                {retFlights.map((f) => (
                  <FlightRow key={f.id} flight={f} cabinLabel={cabinLabel} selected={ret?.id === f.id} onSelect={() => handleSelectRet(f)} />
                ))}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-3">
              {outFlights.map((f) => (
                <FlightRow key={f.id} flight={f} cabinLabel={cabinLabel} selected={outbound?.id === f.id} onSelect={() => handleSelectOutbound(f)} />
              ))}
            </div>
          )}
        </div>

        {(outbound || ret) && (
          <div className="border-t border-slate-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-semibold text-[#023a78]">{_t.results.summary}</div>
              <div className="text-right">
                <div className="text-[11px] text-slate-500">{_t.results.total}</div>
                <div className="text-lg font-bold text-[#d4111a]">{formatVND(total * Math.max(totalPax, 1))}</div>
              </div>
            </div>
            <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-600">
              {outbound && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#eaf3fb] px-2 py-1">
                  <Plane className="size-3 text-[#023a78]" />
                  {outbound.fromCode} <ArrowRight className="size-3" /> {outbound.toCode} · {outbound.departTime} · {outbound.flightNo}
                </span>
              )}
              {ret && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#eaf3fb] px-2 py-1">
                  <Plane className="size-3 text-[#023a78]" />
                  {ret.fromCode} <ArrowRight className="size-3" /> {ret.toCode} · {ret.departTime} · {ret.flightNo}
                </span>
              )}
            </div>
            <Button type="button" className="flex items-center gap-2 w-full bg-[#023a78] hover:bg-[#022f60] disabled:opacity-50 rounded-lg transition-all duration-300" disabled={!canContinue} onClick={onContinue}>
              {_t.results.continue}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


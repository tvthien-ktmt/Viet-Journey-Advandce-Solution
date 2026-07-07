import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchFlights } from '@/api/flights';
import { useFlightSelection } from '@/store/flightSelectionStore';
import { useLang } from '@/store/langStore';
import { formatDate, formatVND } from '@/lib/formatters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Plane, Search } from 'lucide-react';
import type { Flight, FlightSearchRequest } from '@/types/flight';
import React, { useEffect, useCallback } from 'react';

export default function FlightResultsPage() {
  const { t } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const { setRequest, outbound, return: ret, setOutbound, setReturn, total, reset } = useFlightSelection();
  
  const form = location.state as FlightSearchRequest;

  useEffect(() => {
    if (!form) navigate('/');
    else setRequest(form);
    return () => reset(); // clean up on unmount
  }, [form, navigate, setRequest, reset]);

  const { data, isLoading } = useQuery({
    queryKey: ['flights', form],
    queryFn: () => searchFlights(form),
    enabled: !!form,
  });

  if (!form) return null;

  const paxCount = form.adults + form.children + form.infants;
  const isRound = form.tripType === 'round';
  const readyToBook = isRound ? (outbound && ret) : !!outbound;

  return (
    <div className="bg-vna-tint min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-4 max-w-6xl relative">
        <div className="bg-vna-blue text-white rounded-t-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{form.from} → {form.to}</h2>
            {data?.outbound && <Badge className="bg-vna-gold text-white hover:bg-vna-gold border-none transition-all duration-300">{data.outbound.length} chuyến bay</Badge>}
          </div>
          <p className="text-white/80 text-sm mt-1">
            {formatDate(form.departDate)} · {paxCount} hành khách · {t(`cabin.${form.cabin}`)}
          </p>
        </div>

        <div className="bg-white rounded-b-xl shadow-md min-h-[500px] border border-vna-border p-4 md:p-6">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-24 w-full" />
              ))}
            </div>
          ) : !data?.outbound?.length ? (
            <div className="flex flex-col items-center py-20 text-center px-4">
              <Search className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-[#0b1f3a]">Không tìm thấy chuyến bay</h3>
              <p className="text-[#64748b] mt-2">Thử thay đổi ngày hoặc điểm đến khác</p>
              <button onClick={() => navigate(-1)}
                className="mt-6 px-6 py-2 bg-[#023a78] text-white rounded-full hover:bg-[#022d5e] transition-colors">
                Tìm lại
              </button>
            </div>
          ) : (
            <Tabs defaultValue="outbound" className="w-full">
              <TabsList className="mb-6 bg-slate-100 p-1 rounded-lg w-full md:w-auto grid grid-cols-1 md:grid-cols-2 md:inline-grid">
                <TabsTrigger value="outbound" className="rounded-md">{t('flight.outbound')} ({form.from} - {form.to})</TabsTrigger>
                {isRound && (
                  <TabsTrigger value="return" disabled={!outbound} className="rounded-md">
                    {t('flight.return')} ({form.to} - {form.from})
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="outbound" className="space-y-3">
                {data.outbound.map(f => (
                  <FlightCard key={f.id} flight={f} selected={outbound?.id === f.id} onSelect={setOutbound} />
                ))}
              </TabsContent>
              
              {isRound && data.return && (
                <TabsContent value="return" className="space-y-3">
                  {data.return.map(f => (
                    <FlightCard key={f.id} flight={f} selected={ret?.id === f.id} onSelect={setReturn} />
                  ))}
                </TabsContent>
              )}
            </Tabs>
          )}
        </div>

        {readyToBook && (
          <div className="fixed md:sticky bottom-0 md:bottom-4 left-0 w-full md:w-auto z-40 bg-vna-blue text-white md:rounded-xl p-4 md:p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] md:mt-6 transition-all animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-white/70">{t('flight.total')} ({paxCount} {t('flight.passengers')})</p>
                <p className="text-xl md:text-2xl font-bold text-vna-gold">{formatVND(total() * paxCount)}</p>
              </div>
              <Button 
                className="bg-vna-gold hover:bg-vna-gold-dark text-white px-6 md:px-8 shadow-lg font-bold rounded-lg transition-all duration-300"
                onClick={() => {
                  sessionStorage.setItem('holdState', JSON.stringify({ outbound, return: ret, request: form }));
                  navigate('/booking/hold');
                }}
              >
                {t('flight.continue')} →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const FlightCard = React.memo(function FlightCard({ flight, selected, onSelect }: { flight: Flight, selected: boolean, onSelect: (flight: Flight) => void }) {
  const { t } = useLang();
  return (
    <div className={`bg-white rounded-xl p-4 md:p-5 hover:shadow-md transition border ${selected ? 'border-vna-gold ring-1 ring-vna-gold' : 'border-vna-border'}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-4 justify-between md:justify-start w-full">
            <div className="text-center md:text-left">
              <p className="text-xl md:text-2xl font-bold text-vna-text">{flight.departTime}</p>
            </div>
            <div className="flex-1 md:flex-none md:w-48 flex flex-col items-center">
              <p className="text-[10px] md:text-xs text-vna-muted whitespace-nowrap">
                {flight.duration}{flight.stops > 0 && ` · ${flight.stops} điểm dừng`}
              </p>
              <div className="flex items-center gap-2 w-full my-1">
                <div className="h-px bg-vna-border flex-1" />
                <Plane className="text-vna-sky" size={16} />
                <div className="h-px bg-vna-border flex-1" />
              </div>
              <p className="text-[10px] text-vna-gold font-medium">{flight.flightNo}</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xl md:text-2xl font-bold text-vna-text">
                {flight.arriveTime}
                {flight.nextDay && <sup className="text-vna-red text-[10px] ml-1">{t('flight.nextDay')}</sup>}
              </p>
            </div>
          </div>
          <p className="text-xs text-vna-muted mt-3 md:mt-2">{flight.aircraft} · {t(`cabin.${flight.cabin}`)}</p>
        </div>
        
        <div className="text-right w-full md:w-auto flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0">
          <div>
            <p className="text-xl md:text-2xl font-bold text-vna-blue">{formatVND(flight.priceVND)}</p>
            <p className="text-[10px] md:text-xs text-vna-red mb-2 text-left md:text-right">
              {t('flight.seatsLeft').replace('{count}', String(flight.seatsLeft))}
            </p>
          </div>
          <Button 
            onClick={() => onSelect(flight)}
            className={`w-32 ${selected ? 'bg-vna-gold hover:bg-vna-gold-dark text-white' : 'bg-vna-blue hover:bg-vna-blue-700 text-white'}`}
          >
            {selected ? t('flight.selected') : t('flight.select')}
          </Button>
        </div>
      </div>
    </div>
  );
});


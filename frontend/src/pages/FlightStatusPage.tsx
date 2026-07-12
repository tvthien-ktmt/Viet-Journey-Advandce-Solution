import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { useT } from '@/store/langStore';
import { Search, Plane, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { getFlightStatus, getFlightStatusByRoute } from '@/api/flights';
import { toast } from 'sonner';

type FlightStatus = 'onTime' | 'delayed' | 'cancelled' | 'boarding' | 'departed' | 'landed';

interface FlightStatusData {
  id: string;
  flightNo: string;
  from: string;
  to: string;
  scheduledDepart: string;
  actualDepart: string;
  scheduledArrive: string;
  actualArrive: string;
  status: FlightStatus;
  gate: string;
  terminal: string;
}

const _mockStatuses: FlightStatusData[] = [
  { id: '1', flightNo: 'VN201', from: 'HAN', to: 'SGN', scheduledDepart: '08:00', actualDepart: '08:00', scheduledArrive: '10:15', actualArrive: '10:15', status: 'onTime', gate: '12', terminal: 'T1' },
  { id: '2', flightNo: 'VN203', from: 'HAN', to: 'SGN', scheduledDepart: '09:00', actualDepart: '09:45', scheduledArrive: '11:15', actualArrive: '12:00', status: 'delayed', gate: '14', terminal: 'T1' },
  { id: '3', flightNo: 'VN205', from: 'HAN', to: 'SGN', scheduledDepart: '10:00', actualDepart: '10:00', scheduledArrive: '12:15', actualArrive: '12:15', status: 'boarding', gate: '15', terminal: 'T1' },
  { id: '4', flightNo: 'VN207', from: 'HAN', to: 'SGN', scheduledDepart: '06:00', actualDepart: '06:00', scheduledArrive: '08:15', actualArrive: '08:10', status: 'landed', gate: '2', terminal: 'T1' },
  { id: '5', flightNo: 'VN209', from: 'HAN', to: 'SGN', scheduledDepart: '18:00', actualDepart: '--:--', scheduledArrive: '20:15', actualArrive: '--:--', status: 'cancelled', gate: '--', terminal: 'T1' },
];

export default function FlightStatusPage() {
  const _t = useT();
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<FlightStatusData[] | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Search state
  const [flightNo, setFlightNo] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleSearchByFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightNo) return;
    performSearch('flight');
  };

  const handleSearchByRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    performSearch('route');
  };

  const performSearch = async (type: 'flight' | 'route') => {
    setIsSearching(true);
    
    try {
      if (type === 'flight') {
        const res: any = await getFlightStatus(flightNo, date);
        if (res.success && res.data) {
          const flightData = res.data;
          setResults([{
            id: flightData.flightNumber,
            flightNo: flightData.flightNumber,
            from: flightData.departureAirport,
            to: flightData.arrivalAirport,
            scheduledDepart: new Date(flightData.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            actualDepart: new Date(flightData.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            scheduledArrive: new Date(flightData.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            actualArrive: new Date(flightData.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            status: flightData.status,
            gate: flightData.gate || 'TBD',
            terminal: flightData.terminal || 'T1'
          }]);
          setLastUpdated(new Date());
        } else {
          setResults([]);
        }
      } else {
        const res: any = await getFlightStatusByRoute(from, to, date);
        if (res.success && res.data && res.data.length > 0) {
          setResults(res.data.map((flightData: any) => ({
            id: flightData.flightNumber,
            flightNo: flightData.flightNumber,
            from: flightData.departureAirport,
            to: flightData.arrivalAirport,
            scheduledDepart: new Date(flightData.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            actualDepart: new Date(flightData.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            scheduledArrive: new Date(flightData.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            actualArrive: new Date(flightData.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            status: flightData.status,
            gate: flightData.gate || 'TBD',
            terminal: flightData.terminal || 'T1'
          })));
          setLastUpdated(new Date());
        } else {
          setResults([]);
        }
      }
    } catch {
      toast.error('Không tìm thấy chuyến bay');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: FlightStatus) => {
    switch(status) {
      case 'onTime': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">{_t('flightstatus.statuses.onTime')}</span>;
      case 'delayed': return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">{_t('flightstatus.statuses.delayed')}</span>;
      case 'cancelled': return <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-bold uppercase">{_t('flightstatus.statuses.cancelled')}</span>;
      case 'boarding': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase animate-pulse">{_t('flightstatus.statuses.boarding')}</span>;
      case 'departed': return <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold uppercase">{_t('flightstatus.statuses.departed')}</span>;
      case 'landed': return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase">{_t('flightstatus.statuses.landed')}</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-vna-blue mb-4">{_t('flightstatus.title')}</h1>
          <p className="text-slate-600">Cập nhật thông tin nhanh chóng và chính xác về chuyến bay của bạn.</p>
        </div>

        <Card className="mb-10 shadow-md rounded-xl">
          <CardContent className="p-0 rounded-xl">
            <Tabs defaultValue="flight" className="w-full">
              <TabsList className="w-full grid grid-cols-1 md:grid-cols-2 rounded-b-none h-14 bg-slate-100 p-0">
                <TabsTrigger value="flight" className="text-base rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-vna-blue data-[state=active]:shadow-none">{_t('flightstatus.byFlight')}</TabsTrigger>
                <TabsTrigger value="route" className="text-base rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-vna-blue data-[state=active]:shadow-none">{_t('flightstatus.byRoute')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="flight" className="p-6 md:p-8 m-0 border-t-0">
                <form onSubmit={handleSearchByFlight} className="grid md:grid-cols-4 gap-6 items-end">
                  <div className="md:col-span-1 space-y-2">
                    <Label htmlFor="flightNo">{_t('flightstatus.flightNo')}</Label>
                    <Input 
                      id="flightNo" 
                      placeholder={_t('flightstatus.flightNoPlaceholder')} 
                      className="uppercase font-semibold tracking-wider h-12 rounded-lg"
                      value={flightNo}
                      onChange={(e) => setFlightNo(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="date">{_t('flightstatus.date')}</Label>
                    <Input 
                      id="date" 
                      type="date"
                      className="h-12 rounded-lg"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Button type="submit" size="lg" className="flex items-center gap-2 w-full bg-vna-gold hover:bg-vna-gold/90 text-white rounded-lg transition-all duration-300" disabled={isSearching}>
                      {isSearching ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Search className="w-4 h-4 mr-2"/> Tìm kiếm</>}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="route" className="p-6 md:p-8 m-0 border-t-0">
                <form onSubmit={handleSearchByRoute} className="grid md:grid-cols-4 gap-6 items-end">
                  <div className="md:col-span-1 space-y-2">
                    <Label htmlFor="from">Điểm đi</Label>
                    <Input 
                      id="from" 
                      placeholder="VD: HAN" 
                      className="uppercase font-semibold tracking-wider h-12 rounded-lg"
                      value={from}
                      onChange={(e) => setFrom(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <Label htmlFor="to">Điểm đến</Label>
                    <Input 
                      id="to" 
                      placeholder="VD: SGN" 
                      className="uppercase font-semibold tracking-wider h-12 rounded-lg"
                      value={to}
                      onChange={(e) => setTo(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <Label htmlFor="date2">{_t('flightstatus.date')}</Label>
                    <Input 
                      id="date2" 
                      type="date"
                      className="h-12 rounded-lg"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Button type="submit" size="lg" className="flex items-center gap-2 w-full bg-vna-gold hover:bg-vna-gold/90 text-white rounded-lg transition-all duration-300" disabled={isSearching}>
                      {isSearching ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Search className="w-4 h-4 mr-2"/> Tìm kiếm</>}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Hint */}
        {!results && (
          <div className="text-center text-sm text-slate-500 flex justify-center mb-10">
            <div className="bg-blue-50 border border-blue-100 text-vna-blue px-4 py-2 rounded-full inline-flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Gợi ý: Tìm chuyến bay <strong>VN201</strong> hoặc chặng <strong>HAN - SGN</strong>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-bold text-slate-800">Kết quả tra cứu ({results.length})</h2>
              {lastUpdated && (
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Cập nhật lúc {format(lastUpdated, 'HH:mm:ss')}
                </p>
              )}
            </div>

            {results.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
                <Plane className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-2">Không tìm thấy chuyến bay</h3>
                <p className="text-slate-500">Vui lòng kiểm tra lại số hiệu chuyến bay hoặc hành trình.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {results.map((flight) => (
                  <Card key={flight.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-vna-blue rounded-xl">
                    <CardContent className="p-0 rounded-xl">
                      <div className="flex flex-col md:flex-row">
                        
                        {/* Flight Info */}
                        <div className="p-6 md:w-1/3 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-vna-blue">{flight.flightNo}</h3>
                              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> {date}</p>
                            </div>
                            {getStatusBadge(flight.status)}
                          </div>
                        </div>

                        {/* Route & Times */}
                        <div className="p-6 md:w-2/3 flex flex-col justify-center">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            
                            <div className="text-center">
                              <p className="text-3xl font-bold text-slate-800">{flight.from}</p>
                              <div className="mt-2 space-y-1">
                                <p className="text-xs text-slate-500">Dự kiến</p>
                                <p className={flight.scheduledDepart !== flight.actualDepart ? "text-sm line-through text-slate-400" : "text-sm font-semibold"}>{flight.scheduledDepart}</p>
                                {flight.scheduledDepart !== flight.actualDepart && (
                                  <p className="text-sm font-bold text-amber-600">{flight.actualDepart}</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              <div className="w-full relative flex items-center justify-center mb-6">
                                <div className="w-full h-px bg-slate-300 absolute" />
                                <Plane className="w-5 h-5 text-slate-400 bg-white px-1 z-10" />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-center">
                                <div className="bg-slate-50 rounded p-1">
                                  <p className="text-[10px] text-slate-500 uppercase">Nhà ga</p>
                                  <p className="font-bold text-sm">{flight.terminal}</p>
                                </div>
                                <div className="bg-slate-50 rounded p-1">
                                  <p className="text-[10px] text-slate-500 uppercase">Cửa</p>
                                  <p className="font-bold text-sm">{flight.gate}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-3xl font-bold text-slate-800">{flight.to}</p>
                              <div className="mt-2 space-y-1">
                                <p className="text-xs text-slate-500">Dự kiến</p>
                                <p className={flight.scheduledArrive !== flight.actualArrive ? "text-sm line-through text-slate-400" : "text-sm font-semibold"}>{flight.scheduledArrive}</p>
                                {flight.scheduledArrive !== flight.actualArrive && (
                                  <p className="text-sm font-bold text-amber-600">{flight.actualArrive}</p>
                                )}
                              </div>
                            </div>

                          </div>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}


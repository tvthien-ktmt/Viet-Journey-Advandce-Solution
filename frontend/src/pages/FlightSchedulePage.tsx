import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { ChevronLeft, Calendar, Plane, Search } from 'lucide-react';

export default function FlightSchedulePage() {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  interface ScheduleResult {
    id: number;
    flightNo: string;
    depart: string;
    arrive: string;
    duration: string;
    aircraft: string;
    days: string;
  }
  const [results, setResults] = useState<ScheduleResult[] | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setResults([
        { id: 1, flightNo: 'VN201', depart: '08:00', arrive: '10:15', duration: '2h 15m', aircraft: 'Airbus A321', days: 'T2, T3, T4, T5, T6, T7, CN' },
        { id: 2, flightNo: 'VN203', depart: '10:00', arrive: '12:15', duration: '2h 15m', aircraft: 'Airbus A350', days: 'T2, T3, T4, T5, T6, T7, CN' },
        { id: 3, flightNo: 'VN205', depart: '14:00', arrive: '16:15', duration: '2h 15m', aircraft: 'Boeing 787', days: 'T2, T4, T6, CN' },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-vna-blue mb-4">Lịch Bay Khai Thác</h1>
          <p className="text-slate-600">Tra cứu lịch bay nội địa và quốc tế của Vietnam Airlines.</p>
        </div>

        <Card className="mb-10 shadow-md rounded-xl">
          <CardContent className="p-6 rounded-xl">
            <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                <Label>Từ (Điểm đi)</Label>
                <Input placeholder="VD: HAN" value={from} onChange={e => setFrom(e.target.value.toUpperCase())} className="uppercase font-bold" required />
              </div>
              <div className="space-y-2">
                <Label>Đến (Điểm đến)</Label>
                <Input placeholder="VD: SGN" value={to} onChange={e => setTo(e.target.value.toUpperCase())} className="uppercase font-bold" required />
              </div>
              <div className="space-y-2">
                <Label>Ngày khởi hành</Label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <Button type="submit" className="flex items-center gap-2 w-full bg-vna-gold text-white rounded-lg" disabled={isSearching}>
                {isSearching ? 'Đang tìm...' : <><Search className="w-4 h-4 mr-2" /> Tra cứu lịch bay</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        {results && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-4">Lịch bay từ {from} đến {to}</h2>
            <div className="space-y-4">
              {results.map(r => (
                <Card key={r.id}>
                  <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 rounded-xl">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-vna-blue">{r.depart}</div>
                        <div className="text-sm text-slate-500">{from}</div>
                      </div>
                      <div className="flex flex-col items-center px-4 w-32">
                        <span className="text-xs text-slate-400 mb-1">{r.duration}</span>
                        <div className="w-full h-px bg-slate-300 relative flex justify-center items-center">
                          <Plane className="w-4 h-4 text-slate-400 absolute bg-white px-0.5" />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-vna-blue">{r.arrive}</div>
                        <div className="text-sm text-slate-500">{to}</div>
                      </div>
                    </div>

                    <div className="text-sm space-y-1 md:text-right flex-1 border-t pt-4 md:border-0 md:pt-0">
                      <p><span className="text-slate-500">Chuyến bay:</span> <strong className="text-vna-blue">{r.flightNo}</strong></p>
                      <p><span className="text-slate-500">Máy bay:</span> <strong>{r.aircraft}</strong></p>
                      <p><span className="text-slate-500">Lịch khai thác:</span> <span className="text-green-600">{r.days}</span></p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


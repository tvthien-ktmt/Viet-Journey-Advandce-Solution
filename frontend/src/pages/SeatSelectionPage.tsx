import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '@/api/booking';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { useT } from '@/store/langStore';
import { Armchair, CheckCircle2, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { BookingPassengerDTO } from '@/types/flight';

type SeatType = 'business' | 'economy' | 'premium' | 'exit-row';
type SeatStatus = 'available' | 'occupied' | 'selected';

interface Seat {
  id: string; // e.g., "1A"
  row: number;
  col: string; // A, B, C, D, E, G
  type: SeatType;
  status: SeatStatus;
  price: number;
}

const COLUMNS_BUSINESS = ['A', 'C', 'D', 'G'];
const COLUMNS_ECONOMY = ['A', 'B', 'C', 'D', 'E', 'G'];

// Simple deterministic random based on string to mock occupied seats
function seededRandom(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return () => {
    hash = Math.sin(hash) * 10000;
    return hash - Math.floor(hash);
  };
}

export default function SeatSelectionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = useT();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  
  const { data: booking } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingApi.get(id as string),
    enabled: !!id
  });

  const requiredSeats = booking?.passengers 
    ? booking.passengers.filter((p: BookingPassengerDTO) => p.type !== 'INFANT' && p.type !== 'Infant').length 
    : 1;

  useEffect(() => {
    // Generate Airbus A321 Layout
    // Business: rows 1-7 (2-2), 28 seats
    // Economy: rows 10-37 (3-3), 168 seats
    const rand = seededRandom(id || 'default');
    const generatedSeats: Seat[] = [];

    // Business
    for (let r = 1; r <= 7; r++) {
      for (const c of COLUMNS_BUSINESS) {
        const isOccupied = rand() < 0.3;
        generatedSeats.push({
          id: `${r}${c}`,
          row: r,
          col: c,
          type: 'business',
          status: isOccupied ? 'occupied' : 'available',
          price: 500000, // Upgrade fee mockup
        });
      }
    }

    // Economy
    for (let r = 10; r <= 37; r++) {
      for (const c of COLUMNS_ECONOMY) {
        const isOccupied = rand() < 0.35;
        let type: SeatType = 'economy';
        let price = 0;
        
        if (r >= 10 && r <= 15) {
          type = 'premium';
          price = 150000;
        } else if (r === 25 || r === 26) {
          type = 'exit-row';
          price = 250000;
        }

        generatedSeats.push({
          id: `${r}${c}`,
          row: r,
          col: c,
          type,
          status: isOccupied ? 'occupied' : 'available',
          price,
        });
      }
    }
    setSeats(generatedSeats);
  }, [id]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'occupied') return;

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= requiredSeats) {
        toast.error(`Bạn chỉ được chọn tối đa ${requiredSeats} ghế cho ${requiredSeats} hành khách.`);
        return;
      }
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  const totalFee = useMemo(() => {
    return selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  }, [selectedSeats]);

  const handleContinue = () => {
    if (selectedSeats.length < requiredSeats) {
      toast.error(`Vui lòng chọn đủ ${requiredSeats} ghế cho tất cả hành khách.`);
      return;
    }
    // Save to local storage for demo
    localStorage.setItem(`booking_${id}_seats`, JSON.stringify(selectedSeats));
    navigate(`/booking/${id}/extras`);
  };

  const renderSeatButton = (seat: Seat | undefined) => {
    if (!seat) return <div className="w-10 h-10" />; // Empty aisle space
    
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    let baseStyles = "w-10 h-10 rounded-t-lg rounded-b-sm font-medium text-xs flex items-center justify-center transition-all duration-200 border-2";
    let colorStyles = "";

    if (seat.status === 'occupied') {
      colorStyles = "bg-slate-200 border-slate-300 text-slate-400 opacity-60 cursor-not-allowed";
    } else if (isSelected) {
      colorStyles = "bg-vna-blue border-vna-blue text-white shadow-md transform scale-110";
    } else {
      colorStyles = "bg-white hover:bg-slate-50 cursor-pointer";
      if (seat.type === 'business') colorStyles += " border-vna-blue text-vna-blue";
      else if (seat.type === 'premium') colorStyles += " border-vna-gold text-vna-gold";
      else if (seat.type === 'exit-row') colorStyles += " border-red-500 text-red-500";
      else colorStyles += " border-slate-300 text-slate-600";
    }

    return (
      <button
        key={seat.id}
        className={cn(baseStyles, colorStyles)}
        onClick={() => handleSeatClick(seat)}
        disabled={seat.status === 'occupied'}
        title={seat.price > 0 ? `${seat.id} - Thêm ${seat.price.toLocaleString()} VND` : seat.id}
      >
        {seat.id}
      </button>
    );
  };

  // Group seats by row for rendering
  const rowsBusiness = Array.from({ length: 7 }, (_, i) => i + 1);
  const rowsEconomy = Array.from({ length: 28 }, (_, i) => i + 10);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex items-center gap-4 mb-6">
          <Button className="flex items-center gap-2 rounded-lg" variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-vna-blue">Chọn chỗ ngồi</h1>
            <p className="text-slate-500">Chuyến bay VN201 • Hành khách: {requiredSeats}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Seat Map Area */}
          <div className="lg:col-span-2 flex flex-col items-center">
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 inline-block max-w-full overflow-x-auto relative pb-20">
              
              {/* Aircraft Nose shape */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-slate-100 rounded-t-[100px] -z-10 opacity-50 border-t border-x border-slate-200"></div>

              <div className="text-center mb-8 pt-4">
                <Badge variant="outline" className="bg-slate-50">Lối vào (Front)</Badge>
              </div>

              {/* Business Class */}
              <div className="mb-12">
                <h3 className="text-center font-bold text-vna-blue mb-4 flex items-center justify-center gap-2">
                  <Armchair className="w-5 h-5" />
                  Thương gia (Business)
                </h3>
                <div className="flex flex-col gap-3 items-center">
                  {rowsBusiness.map(row => {
                    const rowSeats = seats.filter(s => s.row === row);
                    if (rowSeats.length === 0) return null;
                    return (
                      <div key={`biz-${row}`} className="flex items-center gap-2">
                        {renderSeatButton(rowSeats.find(s => s.col === 'A'))}
                        {renderSeatButton(rowSeats.find(s => s.col === 'C'))}
                        <div className="w-8 text-center text-sm font-bold text-slate-400 mx-2">{row}</div>
                        {renderSeatButton(rowSeats.find(s => s.col === 'D'))}
                        {renderSeatButton(rowSeats.find(s => s.col === 'G'))}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-slate-200 w-full mb-12 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Vách ngăn (Bulkhead)
                </div>
              </div>

              {/* Economy Class */}
              <div>
                <h3 className="text-center font-bold text-vna-blue mb-6 flex items-center justify-center gap-2">
                  <Armchair className="w-5 h-5" />
                  Phổ thông (Economy)
                </h3>
                <div className="flex flex-col gap-2 items-center">
                  {rowsEconomy.map(row => {
                    const rowSeats = seats.filter(s => s.row === row);
                    if (rowSeats.length === 0) return null;
                    
                    const isExitRow = row === 25 || row === 26;
                    
                    return (
                      <React.Fragment key={`eco-${row}`}>
                        {isExitRow && (
                          <div className="w-full flex justify-between items-center my-4 px-12 relative">
                             <div className="text-xs font-bold text-red-500 uppercase flex items-center gap-1">
                               <ChevronLeft className="w-4 h-4"/> Lối thoát hiểm
                             </div>
                             <div className="text-xs font-bold text-red-500 uppercase flex items-center gap-1">
                               Lối thoát hiểm <ChevronRight className="w-4 h-4"/>
                             </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5">
                            {renderSeatButton(rowSeats.find(s => s.col === 'A'))}
                            {renderSeatButton(rowSeats.find(s => s.col === 'B'))}
                            {renderSeatButton(rowSeats.find(s => s.col === 'C'))}
                          </div>
                          
                          <div className="w-8 text-center text-sm font-bold text-slate-400 mx-1">{row}</div>
                          
                          <div className="flex gap-1.5">
                            {renderSeatButton(rowSeats.find(s => s.col === 'D'))}
                            {renderSeatButton(rowSeats.find(s => s.col === 'E'))}
                            {renderSeatButton(rowSeats.find(s => s.col === 'G'))}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 space-y-6">
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg rounded-xl">Chú giải (Legend)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-vna-blue rounded border-2 border-vna-blue"></div>
                    <span className="text-sm">Ghế đang chọn</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-slate-200 rounded border-2 border-slate-300 opacity-60"></div>
                    <span className="text-sm">Ghế đã có người</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white rounded border-2 border-slate-300"></div>
                    <span className="text-sm">Ghế tiêu chuẩn (Miễn phí)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white rounded border-2 border-vna-gold"></div>
                    <span className="text-sm text-vna-gold font-medium">Ghế chân rộng (+150k)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white rounded border-2 border-red-500"></div>
                    <span className="text-sm text-red-500 font-medium">Ghế thoát hiểm (+250k)</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg rounded-xl">Ghế đã chọn ({selectedSeats.length}/{requiredSeats})</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSeats.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-sm">
                      Bạn chưa chọn ghế nào.<br/>Vui lòng chọn trên sơ đồ.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedSeats.map((seat, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-vna-blue text-white rounded font-bold flex items-center justify-center">
                              {seat.id}
                            </div>
                            <div>
                              <p className="text-sm font-medium">Hành khách {i + 1}</p>
                              <p className="text-xs text-slate-500">
                                {seat.type === 'premium' ? 'Ghế chân rộng' : 
                                 seat.type === 'exit-row' ? 'Ghế thoát hiểm' : 
                                 seat.type === 'business' ? 'Thương gia' : 'Tiêu chuẩn'}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold">
                            {seat.price > 0 ? `+${seat.price.toLocaleString()} ₫` : 'Miễn phí'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {totalFee > 0 && (
                    <div className="mt-6 pt-4 border-t flex justify-between items-center">
                      <span className="font-medium text-slate-600">Phí chọn chỗ:</span>
                      <span className="text-xl font-bold text-vna-blue">{totalFee.toLocaleString()} ₫</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-vna-gold hover:bg-vna-gold/90 text-white rounded-lg transition-all duration-300" 
                    size="lg"
                    disabled={selectedSeats.length < requiredSeats}
                    onClick={handleContinue}
                  >
                    Tiếp tục mua tiện ích
                  </Button>
                </CardFooter>
              </Card>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


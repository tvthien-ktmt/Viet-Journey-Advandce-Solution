import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui';
import { Button } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Label } from '@/components/ui';
import { ChevronLeft, Luggage, Utensils, Coffee, ShieldCheck, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Passenger {
  id: string;
  name: string;
  baggage: number;
  meal: string;
  lounge: boolean;
  insurance: boolean;
}

const MEAL_OPTIONS = [
  { id: 'none', name: 'Suất ăn tiêu chuẩn (Miễn phí)', price: 0 },
  { id: 'vegetarian', name: 'Suất ăn chay (Vegetarian)', price: 50000 },
  { id: 'halal', name: 'Suất ăn Halal', price: 50000 },
  { id: 'kosher', name: 'Suất ăn Kosher', price: 50000 },
  { id: 'diabetic', name: 'Suất ăn cho người tiểu đường', price: 50000 },
  { id: 'child', name: 'Suất ăn trẻ em (Child meal)', price: 50000 },
];

export default function AddonsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Mock 2 passengers
  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: 'p1', name: 'NGUYEN VAN A', baggage: 0, meal: 'none', lounge: false, insurance: false },
    { id: 'p2', name: 'LE THI B', baggage: 0, meal: 'none', lounge: false, insurance: false },
  ]);

  const BAGGAGE_PRICE_PER_20KG = 150000;
  const LOUNGE_PRICE = 350000;
  const INSURANCE_PRICE = 120000;

  const updatePassenger = useCallback((pid: string, field: keyof Passenger, value: string | number | boolean) => {
    setPassengers(prev => prev.map(p => p.id === pid ? { ...p, [field]: value } : p));
  }, []);

  const handleBaggageChange = useCallback((pid: string, current: number, delta: number) => {
    const newVal = current + delta;
    if (newVal >= 0 && newVal <= 60) {
      updatePassenger(pid, 'baggage', newVal);
    }
  }, [updatePassenger]);

  const totalFee = useMemo(() => {
    return passengers.reduce((sum, p) => {
      let paxSum = 0;
      // Baggage (150k per 20kg block)
      if (p.baggage > 0) paxSum += (p.baggage / 20) * BAGGAGE_PRICE_PER_20KG;
      // Meal
      const mealObj = MEAL_OPTIONS.find(m => m.id === p.meal);
      if (mealObj) paxSum += mealObj.price;
      // Lounge
      if (p.lounge) paxSum += LOUNGE_PRICE;
      // Insurance
      if (p.insurance) paxSum += INSURANCE_PRICE;
      
      return sum + paxSum;
    }, 0);
  }, [passengers]);

  const handleContinue = () => {
    localStorage.setItem(`booking_${id}_addons`, JSON.stringify(passengers));
    navigate(`/payment/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex items-center gap-4 mb-6">
          <Button className="flex items-center gap-2 rounded-lg" variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-vna-blue">Mua thêm tiện ích</h1>
            <p className="text-slate-500">Cá nhân hóa chuyến bay của bạn để có trải nghiệm tốt nhất</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Baggage */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-4 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 text-vna-blue rounded-full flex items-center justify-center">
                  <Luggage className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>Hành lý ký gửi thêm</CardTitle>
                  <CardDescription>Mua trước hành lý để tiết kiệm đến 50% so với mua tại sân bay.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 rounded-xl">
                {passengers.map(p => (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 gap-4">
                    <span className="font-semibold">{p.name}</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-vna-blue">{p.baggage > 0 ? `+${p.baggage} kg` : '0 kg'}</div>
                        <div className="text-xs text-slate-500">
                          {p.baggage > 0 ? `+${((p.baggage / 20) * BAGGAGE_PRICE_PER_20KG).toLocaleString()} ₫` : 'Miễn phí'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" size="icon" className="flex items-center gap-2 w-8 h-8 rounded-lg"
                          onClick={() => handleBaggageChange(p.id, p.baggage, -20)}
                          disabled={p.baggage <= 0}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" size="icon" className="flex items-center gap-2 w-8 h-8 rounded-lg"
                          onClick={() => handleBaggageChange(p.id, p.baggage, 20)}
                          disabled={p.baggage >= 60}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Meals */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-4 rounded-xl">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>Suất ăn đặc biệt</CardTitle>
                  <CardDescription>Đặt trước suất ăn phù hợp với khẩu vị và tôn giáo của bạn.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 rounded-xl">
                {passengers.map(p => (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 gap-4">
                    <span className="font-semibold">{p.name}</span>
                    <select 
                      className="border-slate-200 shadow-sm focus:border-vna-blue focus:ring focus:ring-vna-blue focus:ring-opacity-50 p-2 text-sm rounded-lg"
                      value={p.meal}
                      onChange={(e) => updatePassenger(p.id, 'meal', e.target.value)}
                    >
                      {MEAL_OPTIONS.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} {m.price > 0 ? `(+${m.price.toLocaleString()} ₫)` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Lotus Lounge */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-4 rounded-xl">
                <div className="w-12 h-12 bg-yellow-100 text-vna-gold rounded-full flex items-center justify-center">
                  <Coffee className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>Phòng chờ Bông Sen</CardTitle>
                  <CardDescription>Thư giãn trong không gian sang trọng trước chuyến bay (+350.000 ₫/người).</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 rounded-xl">
                {passengers.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex flex-col">
                      <Label htmlFor={`lounge-${p.id}`} className="font-semibold cursor-pointer">{p.name}</Label>
                      {p.lounge && <span className="text-xs font-medium text-vna-gold mt-1">Đã chọn dịch vụ</span>}
                    </div>
                    <Switch 
                      id={`lounge-${p.id}`} 
                      checked={p.lounge}
                      onCheckedChange={(c) => updatePassenger(p.id, 'lounge', c)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Travel Insurance */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-4 rounded-xl">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>Bảo hiểm du lịch</CardTitle>
                  <CardDescription>An tâm trên mọi hành trình với bảo hiểm toàn diện (+120.000 ₫/người).</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 rounded-xl">
                {passengers.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex flex-col">
                      <Label htmlFor={`insurance-${p.id}`} className="font-semibold cursor-pointer">{p.name}</Label>
                      {p.insurance && <span className="text-xs font-medium text-green-600 mt-1">Bảo vệ toàn diện</span>}
                    </div>
                    <Switch 
                      id={`insurance-${p.id}`} 
                      checked={p.insurance}
                      onCheckedChange={(c) => updatePassenger(p.id, 'insurance', c)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          {/* Sidebar Summary */}
          <div>
            <Card className="sticky top-24 rounded-xl">
              <CardHeader>
                <CardTitle>Tóm tắt tiện ích</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 rounded-xl">
                
                {passengers.map(p => {
                  let pTotal = 0;
                  if (p.baggage > 0) pTotal += (p.baggage / 20) * BAGGAGE_PRICE_PER_20KG;
                  const meal = MEAL_OPTIONS.find(m => m.id === p.meal);
                  if (meal) pTotal += meal.price;
                  if (p.lounge) pTotal += LOUNGE_PRICE;
                  if (p.insurance) pTotal += INSURANCE_PRICE;

                  if (pTotal === 0) return null;

                  return (
                    <div key={`sum-${p.id}`} className="pb-4 border-b last:border-0 last:pb-0">
                      <p className="font-semibold mb-2">{p.name}</p>
                      <ul className="text-sm space-y-2 text-slate-600">
                        {p.baggage > 0 && (
                          <li className="flex justify-between">
                            <span>Hành lý +{p.baggage}kg</span>
                            <span>{((p.baggage / 20) * BAGGAGE_PRICE_PER_20KG).toLocaleString()} ₫</span>
                          </li>
                        )}
                        {meal && meal.price > 0 && (
                          <li className="flex justify-between">
                            <span>{meal.name}</span>
                            <span>{meal.price.toLocaleString()} ₫</span>
                          </li>
                        )}
                        {p.lounge && (
                          <li className="flex justify-between">
                            <span>Phòng chờ</span>
                            <span>{LOUNGE_PRICE.toLocaleString()} ₫</span>
                          </li>
                        )}
                        {p.insurance && (
                          <li className="flex justify-between">
                            <span>Bảo hiểm</span>
                            <span>{INSURANCE_PRICE.toLocaleString()} ₫</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  );
                })}

                {totalFee === 0 && (
                  <p className="text-slate-500 text-sm text-center py-4">Bạn chưa chọn tiện ích nào.</p>
                )}

                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="font-bold text-slate-800">Tổng phí tiện ích</span>
                  <span className="text-xl font-bold text-vna-blue">{totalFee.toLocaleString()} ₫</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-vna-gold hover:bg-vna-gold/90 text-white rounded-lg transition-all duration-300" 
                  size="lg"
                  onClick={handleContinue}
                >
                  {totalFee > 0 ? 'Thanh toán ngay' : 'Bỏ qua & Tiếp tục'}
                </Button>
              </CardFooter>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}


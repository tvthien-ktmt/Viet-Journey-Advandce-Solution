import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, Plane, Info, Calendar, Camera } from 'lucide-react';

const db: Record<string, any> = {
  han: {
    name: 'Hà Nội',
    country: 'Việt Nam',
    hero: 'https://images.unsplash.com/photo-1599708153386-62bf3f035ca5?q=80&w=2070&auto=format&fit=crop',
    description: 'Thủ đô ngàn năm văn hiến với những con phố cổ kính, hồ Hoàn Kiếm thơ mộng và nền ẩm thực phong phú đặc sắc.',
    weather: 'Thích hợp du lịch vào mùa thu (Tháng 9 - 11)',
    attractions: ['Hồ Hoàn Kiếm', 'Phố cổ Hà Nội', 'Văn Miếu Quốc Tử Giám', 'Lăng Bác'],
    airport: 'Sân bay quốc tế Nội Bài (HAN)'
  },
  sgn: {
    name: 'TP. Hồ Chí Minh',
    country: 'Việt Nam',
    hero: 'https://images.unsplash.com/photo-1583417311756-11e0e8e91404?q=80&w=2070&auto=format&fit=crop',
    description: 'Thành phố mang tên Bác năng động, sầm uất, nơi giao thoa giữa văn hóa truyền thống và nhịp sống hiện đại.',
    weather: 'Nắng ấm quanh năm (Tháng 12 - 4 là mùa khô)',
    attractions: ['Chợ Bến Thành', 'Nhà thờ Đức Bà', 'Dinh Độc Lập', 'Phố đi bộ Nguyễn Huệ'],
    airport: 'Sân bay quốc tế Tân Sơn Nhất (SGN)'
  },
  cdg: {
    name: 'Paris',
    country: 'Pháp',
    hero: 'https://images.unsplash.com/photo-1502602898657-3e907614d101?q=80&w=2069&auto=format&fit=crop',
    description: 'Kinh đô ánh sáng của châu Âu, nổi tiếng với Tháp Eiffel, bảo tàng Louvre và bầu không khí lãng mạn vô song.',
    weather: 'Mùa xuân (Tháng 4 - 6) là thời điểm đẹp nhất',
    attractions: ['Tháp Eiffel', 'Bảo tàng Louvre', 'Nhà thờ Đức Bà Paris', 'Khải Hoàn Môn'],
    airport: 'Sân bay Paris-Charles de Gaulle (CDG)'
  }
};

export default function DestinationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fallback to Hanoi if id not found in mock db
  const data = db[id || 'han'] || db['han'];

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[500px]">
        <img 
          src={data.hero} 
          alt={data.name} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        <div className="absolute top-24 left-4 z-10">
          <Button variant="outline" className="flex items-center gap-2 bg-white/20 text-white border-white/30 backdrop-blur-md hover:bg-white/40 rounded-lg transition-all duration-300" onClick={() => navigate('/destinations')}>
            <ChevronLeft className="w-5 h-5 mr-1" /> Tất cả điểm đến
          </Button>
        </div>

        <div className="absolute bottom-16 left-0 right-0 px-4">
          <div className="max-w-5xl mx-auto text-white">
            <div className="flex items-center gap-2 text-vna-gold font-medium mb-3 tracking-wider uppercase text-sm">
              <MapPin className="w-4 h-4" /> {data.country}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">{data.name}</h1>
            <p className="text-lg md:text-xl max-w-2xl text-slate-200 drop-shadow-md">
              {data.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 grid md:grid-cols-3 gap-8">
          
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-vna-blue flex items-center justify-center shrink-0">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">Cửa ngõ chính</h3>
              <p className="text-sm text-slate-600">{data.airport}</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">Thời tiết & Mùa vụ</h3>
              <p className="text-sm text-slate-600">{data.weather}</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-center md:justify-end">
            <Button size="lg" className="w-full md:w-auto bg-vna-gold text-white shadow-md hover:bg-vna-gold/90 rounded-lg transition-all duration-300" onClick={() => navigate('/')}>
              Đặt vé đi {data.name}
            </Button>
          </div>

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-20">
        <div className="flex items-center gap-3 mb-8">
          <Camera className="w-8 h-8 text-vna-blue" />
          <h2 className="text-3xl font-bold text-slate-800">Điểm tham quan nổi bật</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.attractions.map((attr: string, idx: number) => (
            <Card key={idx} className="overflow-hidden border-0 bg-slate-50 hover:bg-white hover:shadow-lg transition-all rounded-xl">
              <CardContent className="p-6 rounded-xl">
                <div className="text-vna-blue font-bold text-4xl opacity-20 mb-4">0{idx + 1}</div>
                <h4 className="font-bold text-slate-800 text-lg">{attr}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui';
import { MapPin, Plane, ArrowRight } from 'lucide-react';

const destinations = [
  { id: 'han', name: 'Hà Nội', type: 'domestic', country: 'Việt Nam', image: '/placeholder.svg' },
  { id: 'sgn', name: 'TP. Hồ Chí Minh', type: 'domestic', country: 'Việt Nam', image: '/placeholder.svg' },
  { id: 'dad', name: 'Đà Nẵng', type: 'domestic', country: 'Việt Nam', image: '/placeholder.svg' },
  { id: 'pqc', name: 'Phú Quốc', type: 'domestic', country: 'Việt Nam', image: '/placeholder.svg' },
  { id: 'hnd', name: 'Tokyo', type: 'international', country: 'Nhật Bản', image: '/placeholder.svg' },
  { id: 'icn', name: 'Seoul', type: 'international', country: 'Hàn Quốc', image: '/placeholder.svg' },
  { id: 'cdg', name: 'Paris', type: 'international', country: 'Pháp', image: '/placeholder.svg' },
  { id: 'lhr', name: 'London', type: 'international', country: 'Vương quốc Anh', image: '/placeholder.svg' },
  { id: 'sin', name: 'Singapore', type: 'international', country: 'Singapore', image: '/placeholder.svg' },
];

export default function DestinationsPage() {
  const _navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filteredData = destinations.filter(d => filter === 'all' || d.type === filter);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      
      {/* Hero Section */}
      <div className="relative h-[400px] mb-12 flex items-center justify-center">
        <img 
          src="/placeholder.svg" 
          alt="Destinations" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Khám phá Thế giới</h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto">
            Hơn 60 điểm đến tuyệt đẹp trên toàn cầu đang chờ đón bạn. Cùng Vietnam Airlines vươn ra thế giới.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold text-slate-800">Điểm đến nổi bật</h2>
          
          <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilter}>
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 md:w-[400px]">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="domestic">Nội địa</TabsTrigger>
              <TabsTrigger value="international">Quốc tế</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map(dest => (
            <Card 
              key={dest.id} 
              className="overflow-hidden group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl"
              onClick={() => _navigate(`/destination/${dest.id}`)}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold uppercase tracking-wider border border-white/30">
                  {dest.type === 'domestic' ? 'Nội địa' : 'Quốc tế'}
                </div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-1.5 text-slate-200 text-sm font-medium mb-1">
                    <MapPin className="w-4 h-4" /> {dest.country}
                  </div>
                  <h3 className="text-2xl font-bold">{dest.name}</h3>
                </div>
              </div>
              <CardContent className="p-0 rounded-xl">
                <div className="px-6 py-4 flex justify-between items-center bg-white">
                  <span className="text-vna-blue font-semibold text-sm group-hover:text-vna-gold transition-colors">
                    Khám phá {dest.name}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-vna-gold group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center bg-blue-50 rounded-2xl p-8 md:p-12 border border-blue-100">
          <Plane className="w-12 h-12 text-vna-blue mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Bạn đã chọn được điểm đến tiếp theo?</h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">Hàng ngàn chuyến bay đang mở bán với mức giá vô cùng hấp dẫn. Hãy đặt vé ngay hôm nay để nhận nhiều ưu đãi.</p>
          <Button size="lg" className="bg-vna-blue text-white rounded-lg" onClick={() => _navigate('/')}>
            Tìm chuyến bay ngay
          </Button>
        </div>

      </div>
    </div>
  );
}




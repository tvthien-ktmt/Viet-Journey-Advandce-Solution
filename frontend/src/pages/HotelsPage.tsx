import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Star, Heart } from 'lucide-react';

const HOTELS = [
  { id: 1, name: 'Vinpearl Resort Nha Trang', location: 'Nha Trang', stars: 5, price: 2500000, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop' },
  { id: 2, name: 'InterContinental Danang', location: 'Đà Nẵng', stars: 5, price: 5500000, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop' },
  { id: 3, name: 'JW Marriott Phu Quoc', location: 'Phú Quốc', stars: 5, price: 6200000, image: 'https://images.unsplash.com/photo-1542314831-c6a4d2759827?q=80&w=2070&auto=format&fit=crop' },
  { id: 4, name: 'Melia Hanoi', location: 'Hà Nội', stars: 4, price: 1800000, image: 'https://images.unsplash.com/photo-1551882547-ff40c0d129df?q=80&w=2070&auto=format&fit=crop' },
];

interface Hotel {
  id: number;
  name: string;
  location: string;
  stars: number;
  price: number;
  image: string;
}

const HotelCard = React.memo(({ hotel, isWishlist, onToggleWishlist }: {
  hotel: Hotel,
  isWishlist: boolean,
  onToggleWishlist: (e: React.MouseEvent, id: number) => void
}) => {
  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all cursor-pointer group rounded-xl">
      <div className="relative h-48 overflow-hidden">
        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1 text-white text-xs">
          <Star className="w-3 h-3 fill-vna-gold text-vna-gold" /> {hotel.stars}.0
        </div>
        <button onClick={(e) => onToggleWishlist(e, hotel.id)} className="absolute top-2 left-2 p-2 bg-black/30 hover:bg-black/50 rounded-full shadow-sm transition-colors backdrop-blur-sm">
          <Heart className={`w-5 h-5 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>
      </div>
      <CardContent className="p-4 rounded-xl">
        <h3 className="font-bold text-lg text-slate-800 truncate mb-1">{hotel.name}</h3>
        <p className="text-slate-500 text-sm flex items-center gap-1 mb-4"><MapPin className="w-3 h-3" /> {hotel.location}</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-slate-400">Giá từ</p>
            <p className="font-bold text-vna-gold text-lg">{hotel.price?.toLocaleString('vi-VN')} ₫</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => (window.location.href = `/hotel/${hotel.id}`)} className="text-vna-blue border-vna-blue hover:bg-blue-50 rounded-lg transition-all duration-300">Đặt phòng</Button>
        </div>
      </CardContent>
    </Card>
  );
});

import { useQuery } from '@tanstack/react-query';
import { getHotels } from '@/api/hotels';
import { useNavigate } from 'react-router-dom';

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['hotels', searchTerm],
    queryFn: () => getHotels({ query: searchTerm }),
  });

  const toggleWishlist = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredHotels = data?.content || HOTELS.filter(h => h.location.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      {/* Hero */}
      <div className="relative h-[300px] mb-12 flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" alt="Hotels" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl font-bold mb-4">Khách sạn & Khu nghỉ dưỡng</h1>
          <p className="text-lg text-slate-200">Tìm kiếm và đặt phòng khách sạn đẳng cấp cùng VNA Holidays.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-10 flex gap-4 max-w-3xl mx-auto -mt-20 relative z-20">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="Nhập điểm đến (VD: Phú Quốc, Đà Nẵng...)" 
              className="pl-10 h-12 rounded-lg"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="h-12 px-8 bg-vna-blue rounded-lg">Tìm kiếm</Button>
        </div>

        {isLoading && <p className="text-center py-10">Đang tải...</p>}
        {isError && <p className="text-center py-10 text-red-500">Lỗi tải dữ liệu. Hiển thị dữ liệu mẫu.</p>}
        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredHotels.map((hotel: any) => (
            <HotelCard 
              key={hotel.id} 
              hotel={hotel} 
              isWishlist={!!wishlist[hotel.id]} 
              onToggleWishlist={toggleWishlist} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

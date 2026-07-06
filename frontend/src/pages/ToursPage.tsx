import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Calendar, Star, Users, Heart } from 'lucide-react';

const mockTours = [
  { id: '1', name: 'Khám phá Mùa Thu Nhật Bản', duration: '6 Ngày 5 Đêm', location: 'Tokyo - Kyoto - Osaka', price: 25900000, rating: 4.8, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop' },
  { id: '2', name: 'Trải nghiệm Châu Âu Cổ Kính', duration: '10 Ngày 9 Đêm', location: 'Pháp - Thụy Sĩ - Ý', price: 68000000, rating: 4.9, image: 'https://images.unsplash.com/photo-1502602898657-3e907614d101?q=80&w=2069&auto=format&fit=crop' },
  { id: '3', name: 'Thiên đường Đảo ngọc Phú Quốc', duration: '3 Ngày 2 Đêm', location: 'Phú Quốc, Việt Nam', price: 4500000, rating: 4.7, image: 'https://images.unsplash.com/photo-1629801831826-6d60ed37286f?q=80&w=2070&auto=format&fit=crop' },
  { id: '4', name: 'Sắc xuân Hàn Quốc', duration: '5 Ngày 4 Đêm', location: 'Seoul - Nami - Jeju', price: 15500000, rating: 4.6, image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=2074&auto=format&fit=crop' },
  { id: '5', name: 'Nét đẹp Cổ kính Châu Á', duration: '4 Ngày 3 Đêm', location: 'Bắc Kinh - Thượng Hải', price: 18900000, rating: 4.5, image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2070&auto=format&fit=crop' },
  { id: '6', name: 'Đảo rồng Komodo huyền bí', duration: '5 Ngày 4 Đêm', location: 'Bali - Komodo', price: 19500000, rating: 4.8, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop' },
];

interface Tour {
  id: string;
  name: string;
  duration: string;
  location: string;
  price: number;
  rating: number;
  image: string;
}

const TourCard = React.memo(({ tour, isWishlist, onToggleWishlist, onClick }: { 
  tour: Tour, 
  isWishlist: boolean, 
  onToggleWishlist: (e: React.MouseEvent, id: string) => void,
  onClick: () => void 
}) => {
  return (
    <Card className="overflow-hidden cursor-pointer group border-0 shadow-md hover:shadow-xl transition-all flex flex-col rounded-xl" onClick={onClick}>
      <div className="h-56 relative overflow-hidden shrink-0">
        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-sm font-bold flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-vna-gold fill-current" /> {tour.rating}
        </div>
        <button onClick={(e) => onToggleWishlist(e, tour.id)} className="absolute top-4 left-4 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors">
          <Heart className={`w-5 h-5 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
        </button>
      </div>
      <CardContent className="p-6 flex-1 flex flex-col bg-white rounded-xl">
        <div className="flex items-center text-xs text-slate-500 font-semibold mb-3 uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 mr-1" /> {tour.location}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-vna-blue transition-colors line-clamp-2">{tour.name}</h3>
        
        <div className="flex items-center gap-4 text-sm text-slate-600 mb-6 mt-auto">
          <div className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-slate-400" /> {tour.duration}</div>
          <div className="flex items-center"><Users className="w-4 h-4 mr-1.5 text-slate-400" /> Nhóm 10-15</div>
        </div>

        <div className="pt-4 border-t flex items-center justify-between mt-auto">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Giá từ</p>
            <p className="text-lg font-bold text-vna-blue">{tour.price.toLocaleString()} ₫</p>
          </div>
          <Button variant="outline" className="group-hover:bg-vna-blue group-hover:text-white transition-colors border-vna-blue text-vna-blue rounded-lg">Chi tiết</Button>
        </div>
      </CardContent>
    </Card>
  );
});

export default function ToursPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      
      {/* Hero Section */}
      <div className="relative h-[300px] mb-12 flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" 
          alt="Tours" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
        
        <div className="relative z-10 text-center text-white px-4">
          <Badge className="bg-vna-gold hover:bg-vna-gold text-white mb-4 uppercase tracking-widest text-xs px-3 py-1 transition-all duration-300">VNA Holidays</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Khám phá thế giới cùng VNA</h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto drop-shadow">
            Trọn gói vé máy bay, khách sạn và trải nghiệm. Khám phá những hành trình được thiết kế độc quyền.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Tour Nổi Bật</h2>
            <p className="text-slate-500 mt-1">Lựa chọn hàng đầu từ khách hàng</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockTours.map(tour => (
            <TourCard 
              key={tour.id} 
              tour={tour} 
              isWishlist={!!wishlist[tour.id]} 
              onToggleWishlist={toggleWishlist} 
              onClick={() => navigate(`/tour/${tour.id}`)} 
            />
          ))}
        </div>

      </div>
    </div>
  );
}

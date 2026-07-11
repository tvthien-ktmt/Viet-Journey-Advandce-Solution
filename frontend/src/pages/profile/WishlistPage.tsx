import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/api/profile';
import { useT } from '@/store/langStore';
import { Card } from '@/components/ui';
import { Heart, MapPin, Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatVND } from '@/lib/formatters';
import { toast } from 'sonner';

export default function WishlistPage() {
  const t = useT();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => profileApi.wishlist.list()
  });

  const wishlist = (data as any)?.data || [];
  
  const handleRemove = async (id: number) => {
    try {
      await profileApi.wishlist.remove(String(id));
      toast.success('Đã xoá khỏi danh sách yêu thích');
      refetch();
    } catch (e) {
      toast.error('Có lỗi xảy ra');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-vna-blue" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-vna-text mb-6 flex items-center gap-2">
        <Heart className="w-6 h-6 text-vna-red fill-vna-red" />
        Mục yêu thích
      </h1>

      {wishlist.length === 0 ? (
        <Card className="p-12 text-center text-slate-500">
          <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-lg">Bạn chưa có mục yêu thích nào.</p>
          <Link to="/tours" className="text-vna-blue hover:underline mt-2 inline-block">
            Khám phá các tour nổi bật
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlist.map((item: any) => {
            const isTour = !!item.tourId;
            const target = item.tour || item.hotel;
            if (!target) return null;

            return (
              <Card key={item.id} className="overflow-hidden group hover:shadow-md transition-shadow relative">
                <button 
                  onClick={(e) => { e.preventDefault(); handleRemove(item.id); }}
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                >
                  <Heart className="w-4 h-4 text-vna-red fill-vna-red" />
                </button>
                <Link to={isTour ? `/tours/${target.slug || target.id}` : `/hotel/${target.id}`} className="block">
                  <div className="aspect-[16/9] relative">
                    <img 
                      src={target.image || '/placeholder.svg'} 
                      alt={target.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-semibold rounded-md">
                        {isTour ? 'Tour' : 'Hotel'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-vna-text mb-2 line-clamp-1 group-hover:text-vna-blue transition-colors">
                      {target.name}
                    </h3>
                    <div className="flex items-center text-slate-500 text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1 shrink-0" />
                      <span className="line-clamp-1">{target.location}</span>
                    </div>
                    {isTour && target.duration && (
                      <div className="flex items-center text-slate-500 text-sm mb-3">
                        <Calendar className="w-4 h-4 mr-1 shrink-0" />
                        <span>{target.duration}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
                      <div>
                        <span className="text-xs text-slate-500 uppercase font-medium">Giá từ</span>
                        <div className="font-bold text-vna-blue text-lg">
                          {formatVND(Number(target.price))}
                        </div>
                      </div>
                      <div className="text-vna-gold text-sm font-semibold">
                        Xem chi tiết →
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

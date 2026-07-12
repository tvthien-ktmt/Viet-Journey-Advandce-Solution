import { useQuery } from '@tanstack/react-query';
import { promotionsApi } from '@/api/promotions';
import { Card, Button } from '@/components/ui';
import { Tag, Clock } from 'lucide-react';
import { formatVND, formatDate } from '@/lib/formatters';

export default function PromotionsPage() {
  const { data: promos, isLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: () => promotionsApi.getAll()
  });

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <h1 className="text-3xl font-bold text-vna-text mb-8">Chương trình Khuyến mãi</h1>
      
      {isLoading ? (
        <div className="text-center py-12">Đang tải dữ liệu...</div>
      ) : promos?.length === 0 ? (
        <div className="text-center py-12 text-vna-muted">Hiện chưa có chương trình khuyến mãi nào.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos?.map((promo: any) => (
            <Card key={promo.id} className="overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              <div className="h-48 bg-gradient-to-r from-vna-blue to-blue-600 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="text-white text-center z-10 p-4">
                  <Tag className="w-12 h-12 mx-auto mb-2 text-vna-gold" />
                  <h3 className="font-bold text-xl line-clamp-2">{promo.description}</h3>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-vna-muted">Mã khuyến mãi</p>
                    <p className="font-mono font-bold text-lg text-vna-blue bg-vna-tint px-2 py-1 rounded inline-block mt-1">{promo.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-vna-muted">Giảm</p>
                    <p className="font-bold text-vna-red text-lg">
                      {promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}%` : formatVND(promo.discountValue)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-vna-muted mt-auto pt-4 border-t border-vna-border">
                  <Clock size={16} />
                  <span>HSD: {formatDate(new Date(promo.validUntil).toISOString())}</span>
                </div>
                
                <Button 
                  className="w-full mt-4 bg-vna-gold text-vna-blue hover:bg-yellow-500" 
                  onClick={() => window.location.href = `/promotions/${promo.code}`}
                >
                  Xem chi tiết & Sử dụng
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

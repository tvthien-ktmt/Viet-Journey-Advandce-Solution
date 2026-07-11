import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { promotionsApi } from '@/api/promotions';
import { Card, Button } from '@/components/ui';
import { Tag, Calendar, Copy, Check, ArrowLeft } from 'lucide-react';
import { formatVND, formatDate } from '@/lib/formatters';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PromotionDetailPage() {
  const { code } = useParams<{ code: string }>();
  const [copied, setCopied] = useState(false);
  
  const { data: promo, isLoading } = useQuery({
    queryKey: ['promotion', code],
    queryFn: () => promotionsApi.getByCode(code as string),
    enabled: !!code
  });

  const handleCopy = () => {
    if (promo?.code) {
      navigator.clipboard.writeText(promo.code);
      setCopied(true);
      toast.success('Đã sao chép mã khuyến mãi');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) return <div className="text-center py-20">Đang tải...</div>;
  if (!promo) return <div className="text-center py-20 text-vna-red">Không tìm thấy mã khuyến mãi này.</div>;

  const discountText = promo.discountType === 'PERCENTAGE' 
    ? `Giảm ${promo.discountValue}%` 
    : `Giảm ${formatVND(promo.discountValue)}`;

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <Link to="/promotions" className="inline-flex items-center text-vna-blue hover:underline mb-6">
        <ArrowLeft size={16} className="mr-2" /> Quay lại danh sách
      </Link>
      
      <div className="max-w-3xl mx-auto">
        <div className="h-64 bg-gradient-to-r from-vna-blue to-blue-700 rounded-t-2xl flex flex-col items-center justify-center text-white relative">
          <Tag className="w-16 h-16 text-vna-gold mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-center px-4">{promo.description}</h1>
        </div>
        
        <Card className="rounded-t-none rounded-b-2xl p-8 border-t-0 shadow-lg relative -mt-4 bg-white z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-vna-border">
            <div>
              <p className="text-vna-muted mb-2">Mã ưu đãi (Voucher Code)</p>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-3xl text-vna-blue bg-vna-tint px-4 py-2 rounded-lg tracking-wider border-2 border-dashed border-vna-blue/30">
                  {promo.code}
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleCopy}
                  className={copied ? "text-green-600 border-green-600" : ""}
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </Button>
              </div>
            </div>
            
            <div className="bg-vna-tint p-4 rounded-xl text-center min-w-[200px]">
              <p className="text-sm text-vna-muted mb-1">Mức giảm</p>
              <p className="text-3xl font-bold text-vna-red">{discountText}</p>
            </div>
          </div>
          
          <div className="py-8 space-y-6">
            <h3 className="text-xl font-bold">Điều kiện áp dụng</h3>
            <ul className="list-disc pl-5 space-y-3 text-vna-text">
              <li>Mã chỉ có giá trị khi đặt vé và thanh toán trực tuyến trên Viet Journey.</li>
              <li>Không áp dụng đồng thời cùng các chương trình khuyến mãi khác.</li>
              <li>Khuyến mãi có thể kết thúc sớm hơn dự kiến nếu hết ngân sách.</li>
              <li>Áp dụng cho mọi hạng ghế và hành trình (trừ trường hợp có quy định khác).</li>
            </ul>
            
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-lg mt-6">
              <Calendar className="text-vna-muted" />
              <div>
                <p className="font-medium">Thời gian áp dụng</p>
                <p className="text-sm text-vna-muted">
                  Từ {formatDate(new Date(promo.validFrom).toISOString())} đến {formatDate(new Date(promo.validUntil).toISOString())}
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-vna-border text-center">
            <Button 
              size="lg" 
              className="bg-vna-gold text-vna-blue hover:bg-yellow-500 font-bold px-12" 
              onClick={() => window.location.href = "/"}
            >
              Tìm chuyến bay ngay
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

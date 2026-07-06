import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Calendar, Share2, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // MOCK CONTENT
  const blog = {
    id: id,
    title: 'Vietnam Airlines chính thức mở đường bay thẳng đến Munich (Đức)',
    category: 'Tin tức VNA',
    date: '04/10/2025',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop',
    content: `
      <p class="lead font-medium text-lg text-slate-700 mb-6">Từ tháng 10 năm 2025, Vietnam Airlines chính thức khai trương đường bay thẳng giữa Hà Nội / TP. Hồ Chí Minh và Munich – thủ phủ của bang Bavaria, Đức. Đây là bước tiến quan trọng trong chiến lược mở rộng mạng bay quốc tế của Hãng hàng không Quốc gia Việt Nam.</p>
      
      <h3 class="text-2xl font-bold text-slate-800 mt-10 mb-4">Mở rộng kết nối Việt Nam - Châu Âu</h3>
      <p class="mb-4">Đường bay mới sẽ được khai thác bằng siêu máy bay Boeing 787-9 Dreamliner với tần suất 4 chuyến/tuần. Munich là điểm đến thứ hai tại Đức và điểm đến thứ 6 tại Châu Âu mà Vietnam Airlines khai thác đường bay thẳng.</p>
      <p class="mb-4">Phát biểu tại buổi lễ công bố, đại diện Vietnam Airlines nhấn mạnh: "Việc mở đường bay thẳng đến Munich không chỉ đáp ứng nhu cầu đi lại ngày càng tăng giữa Việt Nam và Đức, mà còn mở ra những cơ hội mới về hợp tác kinh tế, thương mại, du lịch và giao lưu văn hóa giữa hai nước."</p>

      <img src="https://images.unsplash.com/photo-1540339832862-474599807856?q=80&w=2070&auto=format&fit=crop" alt="Cabin" class="w-full rounded-2xl my-8 object-cover h-[400px]" />

      <h3 class="text-2xl font-bold text-slate-800 mt-10 mb-4">Lịch bay chi tiết</h3>
      <ul class="list-disc pl-6 mb-8 space-y-2 text-slate-700">
        <li><strong>Hà Nội (HAN) - Munich (MUC):</strong> Khởi hành lúc 23:50 thứ 6 và Chủ nhật hàng tuần.</li>
        <li><strong>Munich (MUC) - Hà Nội (HAN):</strong> Khởi hành lúc 13:35 thứ 7 và Thứ 2 hàng tuần.</li>
        <li><strong>TP. Hồ Chí Minh (SGN) - Munich (MUC):</strong> Khởi hành lúc 23:50 thứ 2 và thứ 4 hàng tuần.</li>
        <li><strong>Munich (MUC) - TP. Hồ Chí Minh (SGN):</strong> Khởi hành lúc 13:35 thứ 3 và thứ 5 hàng tuần.</li>
      </ul>

      <p class="mb-4">Nhân dịp khai trương đường bay mới, Vietnam Airlines triển khai chương trình ưu đãi đặc biệt với mức giá khứ hồi chỉ từ 14.999.000 VNĐ (đã bao gồm thuế, phí). Ưu đãi áp dụng cho vé xuất từ nay đến hết ngày 30/11/2025, cho hành trình khởi hành trước 31/03/2026.</p>
    `
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Đã sao chép liên kết');
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-24">
      
      <div className="max-w-4xl mx-auto px-4">
        
        <Button variant="ghost" className="flex items-center gap-2 mb-8 text-slate-500 hover:text-vna-blue rounded-lg transition-all duration-300" onClick={() => navigate('/blog')}>
          <ChevronLeft className="w-5 h-5 mr-1" /> Trở về danh sách
        </Button>

        <div className="mb-10">
          <Badge className="bg-blue-50 text-vna-blue hover:bg-blue-100 mb-6 text-sm px-3 py-1 transition-all duration-300">{blog.category}</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-vna-text mb-6 leading-tight">{blog.title}</h1>
          <div className="flex items-center justify-between border-y border-slate-100 py-4">
            <div className="flex items-center text-slate-500">
              <Calendar className="w-5 h-5 mr-2" /> {blog.date}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 mr-2">Chia sẻ:</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-slate-50 hover:text-slate-800 rounded-lg transition-all duration-300" onClick={copyLink}><LinkIcon className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mb-12">
        <div className="w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg">
          <img src={blog.image} alt="Hero" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* Render HTML content securely using DOMPurify */}
        <div 
          className="prose prose-lg prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-vna-blue hover:prose-a:text-vna-gold transition-all duration-300"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
        />
        
        <div className="mt-16 pt-8 border-t border-slate-200">
          <h3 className="font-bold text-xl mb-6">Bạn có thể quan tâm</h3>
          <div className="grid md:grid-cols-2 gap-6">
            
            <div className="flex gap-4 cursor-pointer group" onClick={() => navigate('/blog/2')}>
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Thumnail"/>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-vna-blue line-clamp-2 mb-2 transition-all duration-300">Top 5 điểm đến không thể bỏ lỡ tại Nhật Bản mùa thu</h4>
                <p className="text-xs text-slate-500">12/09/2025</p>
              </div>
            </div>

            <div className="flex gap-4 cursor-pointer group" onClick={() => navigate('/blog/3')}>
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1540339832862-474599807856?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Thumnail"/>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-vna-blue line-clamp-2 mb-2 transition-all duration-300">Ưu đãi hạng Thương gia: Trải nghiệm đẳng cấp với giá hấp dẫn</h4>
                <p className="text-xs text-slate-500">01/09/2025</p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

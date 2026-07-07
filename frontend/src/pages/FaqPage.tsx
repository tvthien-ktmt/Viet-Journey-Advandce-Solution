import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui';
import { ChevronDown, Search } from 'lucide-react';

const faqs = [
  {
    category: 'Hành lý',
    items: [
      { q: 'Quy định hành lý xách tay của Vietnam Airlines như thế nào?', a: 'Khách hạng Phổ thông được mang 1 kiện hành lý xách tay và 1 phụ kiện với tổng trọng lượng không quá 12kg. Khách hạng Phổ thông đặc biệt và Thương gia được mang 2 kiện hành lý xách tay và 1 phụ kiện với tổng trọng lượng không quá 18kg.' },
      { q: 'Tôi có thể mua thêm hành lý ký gửi không?', a: 'Có, bạn có thể mua thêm hành lý ký gửi trả trước qua website, ứng dụng di động hoặc các phòng vé của Vietnam Airlines chậm nhất 6 tiếng trước giờ bay.' }
    ]
  },
  {
    category: 'Thủ tục chuyến bay (Check-in)',
    items: [
      { q: 'Khi nào tôi có thể làm thủ tục trực tuyến (Online check-in)?', a: 'Bạn có thể làm thủ tục trực tuyến từ 24 tiếng đến 1 tiếng trước giờ khởi hành dự kiến.' },
      { q: 'Tôi có cần in Thẻ lên máy bay ra không?', a: 'Không bắt buộc. Bạn có thể lưu Thẻ lên máy bay điện tử (có mã QR) trên điện thoại và trình cho nhân viên an ninh cùng giấy tờ tùy thân.' }
    ]
  },
  {
    category: 'Hoàn / Đổi vé',
    items: [
      { q: 'Tôi muốn hoàn vé đã mua trên website thì làm thế nào?', a: 'Bạn có thể truy cập mục "Quản lý đặt chỗ" trên website, chọn tính năng "Hoàn vé". Tiền hoàn sẽ được chuyển về tài khoản thẻ bạn đã dùng để thanh toán trong vòng 7-15 ngày làm việc.' },
      { q: 'Phí đổi ngày bay là bao nhiêu?', a: 'Phí đổi ngày bay phụ thuộc vào điều kiện giá vé bạn đã mua. Hạng vé Phổ thông linh hoạt thường được miễn phí đổi ngày, trong khi các hạng vé tiết kiệm có thể thu phí từ 300.000 VNĐ đến 600.000 VNĐ cộng với chênh lệch giá vé (nếu có).' }
    ]
  }
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<string>('0-0');
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      
      <div className="bg-vna-blue py-16 text-white text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">Câu hỏi thường gặp</h1>
        <div className="max-w-2xl mx-auto px-4 relative">
          <Search className="w-5 h-5 absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm câu hỏi của bạn..." 
            className="w-full h-14 pl-12 pr-4 text-slate-800 text-lg focus:outline-none focus:ring-2 focus:ring-vna-gold rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {faqs.map((cat, catIdx) => (
          <div key={catIdx} className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">{cat.category}</h2>
            <div className="space-y-4">
              {cat.items.filter(item => item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())).map((item, itemIdx) => {
                const id = `${catIdx}-${itemIdx}`;
                const isOpen = openIndex === id;
                return (
                  <Card key={id} className={`border-0 shadow-sm overflow-hidden transition-all duration-300 ${isOpen ? 'ring-1 ring-vna-blue' : ''}`}>
                    <div 
                      className={`p-6 flex justify-between items-center cursor-pointer select-none bg-white hover:bg-slate-50`}
                      onClick={() => setOpenIndex(isOpen ? '' : id)}
                    >
                      <h3 className={`font-semibold pr-8 ${isOpen ? 'text-vna-blue' : 'text-slate-800'}`}>{item.q}</h3>
                      <ChevronDown className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <div 
                      className={`transition-all duration-300 ease-in-out bg-slate-50 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                    >
                      <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 mt-4">
                        {item.a}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">Bạn không tìm thấy câu trả lời?</p>
          <button className="text-vna-blue font-bold hover:underline transition-all duration-300" onClick={() => window.location.href='/contact'}>Liên hệ Trung tâm Chăm sóc khách hàng</button>
        </div>
      </div>

    </div>
  );
}


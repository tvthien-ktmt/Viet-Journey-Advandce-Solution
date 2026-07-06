import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

const mockBlogs = [
  { id: '1', title: 'Vietnam Airlines chính thức mở đường bay thẳng đến Munich (Đức)', category: 'Tin tức VNA', date: '04/10/2025', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop' },
  { id: '2', title: 'Top 5 điểm đến không thể bỏ lỡ tại Nhật Bản mùa thu', category: 'Cẩm nang du lịch', date: '12/09/2025', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop' },
  { id: '3', title: 'Ưu đãi hạng Thương gia: Trải nghiệm đẳng cấp với giá hấp dẫn', category: 'Khuyến mãi', date: '01/09/2025', image: 'https://images.unsplash.com/photo-1540339832862-474599807856?q=80&w=2070&auto=format&fit=crop' },
  { id: '4', title: 'Khám phá ẩm thực đường phố Bangkok cùng VNA', category: 'Cẩm nang du lịch', date: '15/08/2025', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2105&auto=format&fit=crop' },
  { id: '5', title: 'Triển khai dịch vụ làm thủ tục tự động (Auto Check-in)', category: 'Tin tức VNA', date: '02/08/2025', image: 'https://images.unsplash.com/photo-1583417311756-11e0e8e91404?q=80&w=2070&auto=format&fit=crop' },
];

export default function BlogPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Tất cả');
  
  const categories = ['Tất cả', 'Tin tức VNA', 'Cẩm nang du lịch', 'Khuyến mãi'];
  const filteredBlogs = mockBlogs.filter(b => filter === 'Tất cả' || b.category === filter);

  const featuredBlog = filteredBlogs[0];
  const otherBlogs = filteredBlogs.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vna-blue mb-4">Tin tức & Trải nghiệm</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">Cập nhật những thông tin mới nhất từ Vietnam Airlines và cẩm nang du lịch hữu ích cho chuyến đi của bạn.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${filter === cat ? 'bg-vna-blue text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <BookOpen className="w-14 h-14 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-[#0b1f3a]">Chưa có bài viết nào</h3>
            <p className="text-[#64748b] mt-1 text-sm">Chúng tôi đang cập nhật thêm nội dung cho chuyên mục này.</p>
          </div>
        )}

        {featuredBlog && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Bài viết nổi bật</h2>
            <Card 
              className="overflow-hidden cursor-pointer group border-0 shadow-lg rounded-xl"
              onClick={() => navigate(`/blog/${featuredBlog.id}`)}
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/3 h-[300px] md:h-[450px] relative overflow-hidden">
                  <img src={featuredBlog.image} alt={featuredBlog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="w-full md:w-1/3 p-8 flex flex-col justify-center bg-white">
                  <Badge variant="outline" className="w-fit mb-4 text-vna-blue border-vna-blue">{featuredBlog.category}</Badge>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 group-hover:text-vna-blue transition-colors line-clamp-4">{featuredBlog.title}</h3>
                  <div className="flex items-center text-sm text-slate-500 mb-6">
                    <Calendar className="w-4 h-4 mr-2" /> {featuredBlog.date}
                  </div>
                  <div className="flex items-center text-vna-gold font-semibold mt-auto">
                    Đọc tiếp <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {otherBlogs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Tin mới nhất</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherBlogs.map(blog => (
                <Card 
                  key={blog.id} 
                  className="overflow-hidden cursor-pointer group border-0 shadow hover:shadow-xl transition-all rounded-xl"
                  onClick={() => navigate(`/blog/${blog.id}`)}
                >
                  <div className="h-[240px] relative overflow-hidden">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-vna-blue hover:bg-white transition-all duration-300">{blog.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 bg-white rounded-xl">
                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-vna-blue transition-colors line-clamp-2 min-h-[56px]">{blog.title}</h3>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="w-4 h-4 mr-2" /> {blog.date}
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-vna-gold transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, Star, Wifi, Coffee, Wind, Tv, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { getHotelBySlug } from '@/api/hotels';

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuth((s) => s.isAuthenticated);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => getHotelBySlug(id as string),
    enabled: !!id
  });

  const handleBook = () => {
    if (!isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để đặt phòng');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    toast.success('Gửi yêu cầu đặt phòng thành công!');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      
      <div className="max-w-6xl mx-auto px-4">
        <Button variant="ghost" className="flex items-center gap-2 mb-6 text-slate-500 hover:text-vna-blue rounded-lg transition-all duration-300" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 mr-1" /> Quay lại tìm kiếm
        </Button>

        {isLoading && <p className="text-center py-10">Đang tải...</p>}
        {isError && <p className="text-center py-10 text-red-500">Lỗi tải dữ liệu. Bạn đang xem dữ liệu mẫu.</p>}

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-vna-gold text-white text-xs font-bold px-2 py-1 rounded">VNA Holidays Khuyên Dùng</span>
            <div className="flex text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-vna-text mb-4">{data?.name || 'InterContinental Hanoi Westlake'}</h1>
          <div className="flex items-center text-slate-500 font-medium">
            <MapPin className="w-5 h-5 mr-1 text-vna-blue" /> {data?.location || '05 Từ Hoa, Tây Hồ, Hà Nội, Việt Nam'}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[400px]">
          <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1542314831-c6a4d27ce66f?q=80&w=800&auto=format&fit=crop" loading="lazy" width="800" height="600" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Hotel" />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop" loading="lazy" width="800" height="600" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Room" />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop" loading="lazy" width="800" height="600" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Bathroom" />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop" loading="lazy" width="800" height="600" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Pool" />
          </div>
          <div className="rounded-2xl overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800&auto=format&fit=crop" loading="lazy" width="800" height="600" className="w-full h-full object-cover" alt="Restaurant" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
              <span className="text-white font-bold text-lg">+12 Ảnh</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Tổng quan</h2>
              <p className="text-slate-600 leading-relaxed">
                Nằm thanh bình trên mặt nước Hồ Tây thơ mộng, InterContinental Hanoi Westlake là biểu tượng của sự sang trọng và bình yên ngay giữa lòng thủ đô nhộn nhịp. Khách sạn tự hào mang đến không gian nghỉ dưỡng đẳng cấp quốc tế với phong cách thiết kế hiện đại pha lẫn nét truyền thống Việt Nam, cùng dịch vụ hoàn hảo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Tiện ích nổi bật</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-600">
                  <Wifi className="w-6 h-6 mb-2 text-vna-blue" />
                  <span className="text-sm">Wi-Fi miễn phí</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-600">
                  <Coffee className="w-6 h-6 mb-2 text-vna-blue" />
                  <span className="text-sm">Bữa sáng Tự chọn</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-600">
                  <Wind className="w-6 h-6 mb-2 text-vna-blue" />
                  <span className="text-sm">Điều hòa nhiệt độ</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-600">
                  <Tv className="w-6 h-6 mb-2 text-vna-blue" />
                  <span className="text-sm">TV màn hình phẳng</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Các loại phòng trống</h2>
              <div className="space-y-4">
                
                {data?.rooms?.map((room: any) => (
                  <Card key={room.id} className="border border-slate-200 rounded-xl">
                    <CardContent className="p-6 flex flex-col md:flex-row gap-6 rounded-xl">
                      <div className="w-full md:w-1/3 h-48 rounded-xl overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop" loading="lazy" width="800" height="600" className="w-full h-full object-cover" alt="Room" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2">{room.type || 'Phòng Classic Hướng Hồ'}</h3>
                          <p className="text-sm text-slate-500 mb-4">{room.capacity || 2} Khách • Hướng hồ</p>
                          <ul className="space-y-1">
                            <li className="flex items-center text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Bao gồm bữa sáng cho 2 người</li>
                            <li className="flex items-center text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Hủy phòng miễn phí trước 24h</li>
                          </ul>
                        </div>
                        <div className="flex items-end justify-between mt-6">
                          <div>
                            <p className="text-2xl font-bold text-vna-gold">{room.pricePerNight?.toLocaleString('vi-VN')} ₫<span className="text-sm text-slate-500 font-normal"> / đêm</span></p>
                          </div>
                          <Button onClick={handleBook} className="bg-vna-blue text-white px-8 rounded-lg">Chọn phòng</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {!data?.rooms?.length && (
                  <Card className="border border-slate-200 rounded-xl">
                    <CardContent className="p-6 flex flex-col md:flex-row gap-6 rounded-xl">
                      <div className="w-full md:w-1/3 h-48 rounded-xl overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop" loading="lazy" width="800" height="600" className="w-full h-full object-cover" alt="Room" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2">Phòng Classic Hướng Hồ</h3>
                          <p className="text-sm text-slate-500 mb-4">43 m² • 1 Giường đôi lớn hoặc 2 Giường đơn • Hướng hồ</p>
                          <ul className="space-y-1">
                            <li className="flex items-center text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Bao gồm bữa sáng cho 2 người</li>
                            <li className="flex items-center text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Hủy phòng miễn phí trước 24h</li>
                          </ul>
                        </div>
                        <div className="flex items-end justify-between mt-6">
                          <div>
                            <p className="text-sm text-slate-500 line-through">4,500,000 ₫</p>
                            <p className="text-2xl font-bold text-vna-gold">3,850,000 ₫<span className="text-sm text-slate-500 font-normal"> / đêm</span></p>
                          </div>
                          <Button onClick={handleBook} className="bg-vna-blue text-white px-8 rounded-lg">Chọn phòng</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

              </div>
            </section>

          </div>

          <div className="space-y-6">
            <Card className="sticky top-24 border-2 border-vna-gold shadow-lg overflow-hidden rounded-xl">
              <div className="bg-vna-gold text-white text-center py-2 font-bold text-sm tracking-widest uppercase">
                Khách Hàng Đánh Giá
              </div>
              <CardContent className="p-6 rounded-xl">
                <div className="flex items-center justify-between mb-6 pb-6 border-b">
                  <div>
                    <div className="text-4xl font-bold text-slate-800">9.2<span className="text-lg text-slate-400 font-normal">/10</span></div>
                    <p className="text-sm font-semibold text-vna-blue mt-1">Tuyệt vời</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Dựa trên</p>
                    <p className="font-bold">1,204 đánh giá</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">Sạch sẽ</span><span className="font-bold">9.5</span></div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-vna-blue w-[95%]"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">Thoải mái</span><span className="font-bold">9.4</span></div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-vna-blue w-[94%]"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">Vị trí</span><span className="font-bold">9.0</span></div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-vna-blue w-[90%]"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">Nhân viên</span><span className="font-bold">9.6</span></div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-vna-blue w-[96%]"></div></div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
}

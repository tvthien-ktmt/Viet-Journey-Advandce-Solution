import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { ChevronLeft, MapPin, Clock, Star, Calendar, CheckCircle2, XCircle, Info, Plane } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTourBySlug } from '@/api/tours';
import { bookingApi } from '@/api/booking';
import { reviewApi } from '@/api/reviews';
import { Textarea } from '@/components/ui';

export default function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const [isBooking, setIsBooking] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tour', id],
    queryFn: () => getTourBySlug(id as string),
    enabled: !!id
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', data?.id],
    queryFn: () => reviewApi.getTourReviews(data!.id.toString()),
    enabled: !!data?.id
  });

  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitReview = useMutation({
    mutationFn: (payload: { tourId: number; rating: number; comment: string }) => reviewApi.addReview(payload),
    onSuccess: () => {
      toast.success('Đánh giá thành công');
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['reviews', data?.id] });
    },
    onError: () => toast.error('Lỗi khi gửi đánh giá')
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để đánh giá');
      return;
    }
    if (data?.id) {
      submitReview.mutate({ tourId: Number(data.id), rating, comment });
    }
  };

  const handleBook = async () => {
    if (!isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để đặt tour');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!data) return;

    setIsBooking(true);
    try {
      const response = await bookingApi.createBooking({
        bookingType: 'tour',
        referenceId: parseInt(data.id, 10),
        passengers: []
      });
      toast.success('Đặt tour thành công! Chuyển hướng đến trang thanh toán...');
      navigate(`/payment/${response.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi đặt tour. Vui lòng thử lại.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      
      <div className="max-w-6xl mx-auto px-4">
        <Button variant="ghost" className="flex items-center gap-2 mb-6 text-slate-500 hover:text-vna-blue rounded-lg transition-all duration-300" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 mr-1" /> Quay lại danh sách
        </Button>

        {isLoading && <p className="text-center py-10">Đang tải...</p>}
        {isError && <p className="text-center py-10 text-red-500">Lỗi tải dữ liệu. Bạn đang xem dữ liệu mẫu.</p>}

        {/* Header */}
        <div className="mb-8">
          <Badge className="bg-vna-gold hover:bg-vna-gold text-white mb-4 uppercase tracking-widest text-xs px-3 py-1 transition-all duration-300">VNA Holidays</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-vna-text mb-4">{data?.name || 'Khám phá Mùa Thu Nhật Bản'}</h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-600 font-medium">
            <div className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-vna-blue" /> {data?.location || 'Tokyo - Kyoto - Osaka'}</div>
            <div className="flex items-center"><Clock className="w-5 h-5 mr-2 text-vna-blue" /> {data?.duration || '6 Ngày 5 Đêm'}</div>
            <div className="flex items-center text-yellow-500"><Star className="w-5 h-5 mr-1 fill-current" /> {data?.rating || 4.8} (124 đánh giá)</div>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 h-[300px] md:h-[500px]">
          <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden">
            <img src={data?.image || "/placeholder.svg"} loading="lazy" width="800" height="600" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Japan" />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img src="/placeholder.svg" loading="lazy" width="800" height="600" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Tokyo" />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img src="/placeholder.svg" loading="lazy" width="800" height="600" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Kyoto" />
          </div>
          <div className="col-span-2 rounded-2xl overflow-hidden relative">
            <img src="/placeholder.svg" loading="lazy" width="800" height="600" className="w-full h-full object-cover" alt="Osaka" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-10">
            
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Info className="w-6 h-6 text-vna-blue" /> Tổng quan hành trình</h2>
              <p className="text-slate-600 leading-relaxed">
                {data?.description || 'Trải nghiệm trọn vẹn vẻ đẹp mùa thu Nhật Bản với lá đỏ rực rỡ tại Kyoto cổ kính, sự sầm uất hiện đại của Tokyo và nhịp sống sôi động tại Osaka. Hành trình được thiết kế đẳng cấp với vé máy bay Vietnam Airlines và hệ thống khách sạn 4 sao tiêu chuẩn quốc tế.'}
              </p>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Plane className="w-6 h-6 text-vna-blue" /> Thông tin chuyến bay</h2>
              <div className="flex flex-col md:flex-row justify-between gap-6 relative">
                
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-sm text-slate-500 font-bold uppercase mb-2">Chuyến đi</div>
                  <div className="font-bold text-lg text-vna-blue">VN384</div>
                  <div className="text-slate-600">Hà Nội (HAN) 08:15</div>
                  <div className="text-slate-600">Haneda (HND) 15:05</div>
                </div>

                <div className="hidden md:flex flex-col justify-center items-center px-4">
                  <div className="w-32 h-px bg-slate-300 relative">
                    <Plane className="w-6 h-6 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1" />
                  </div>
                </div>

                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-sm text-slate-500 font-bold uppercase mb-2">Chuyến về</div>
                  <div className="font-bold text-lg text-vna-blue">VN321</div>
                  <div className="text-slate-600">Kansai (KIX) 10:30</div>
                  <div className="text-slate-600">Hà Nội (HAN) 13:50</div>
                </div>

              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Lịch trình chi tiết</h2>
              <div className="space-y-6">
                
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-vna-blue text-white flex items-center justify-center font-bold">1</div>
                    <div className="w-px h-full bg-slate-200 mt-2"></div>
                  </div>
                  <div className="pb-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Hà Nội - Tokyo (Ăn Trưa/Tối)</h3>
                    <p className="text-slate-600">Sáng: Trưởng đoàn đón quý khách tại sân bay Nội Bài làm thủ tục đáp chuyến bay đi Tokyo. Chiều: Tham quan chùa Asakusa Kannon cổ kính nhất Tokyo. Tối: Ăn tối và nghỉ đêm tại khách sạn 4 sao.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-vna-blue text-white flex items-center justify-center font-bold">2</div>
                    <div className="w-px h-full bg-slate-200 mt-2"></div>
                  </div>
                  <div className="pb-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Tokyo - Núi Phú Sĩ (Ăn Sáng/Trưa/Tối)</h3>
                    <p className="text-slate-600">Sáng: Khởi hành đi khu vực Núi Phú Sĩ. Trải nghiệm hái trái cây theo mùa. Chiều: Tham quan làng cổ Oshino Hakkai dưới chân núi Phú Sĩ. Tối: Tắm Onsen truyền thống tại khách sạn.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-vna-blue text-white flex items-center justify-center font-bold">3</div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Núi Phú Sĩ - Kyoto - Osaka (Ăn Sáng/Trưa/Tối)</h3>
                    <p className="text-slate-600">Sáng: Trải nghiệm tàu Shinkansen siêu tốc đến Kyoto. Tham quan Chùa Thanh Thủy (Kiyomizu Dera). Chiều: Di chuyển về Osaka, tự do mua sắm tại khu Shinsaibashi sầm uất.</p>
                  </div>
                </div>

              </div>
            </section>

            {/* Reviews Section */}
            <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm mt-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Star className="w-6 h-6 text-vna-gold fill-current" /> Đánh giá của khách hàng</h2>
              
              <div className="space-y-6 mb-8">
                {reviews?.length === 0 ? (
                  <p className="text-slate-500">Chưa có đánh giá nào.</p>
                ) : (
                  reviews?.map((rv: any) => (
                    <div key={rv.id} className="border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                          {rv.user?.fullName?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold">{rv.user?.fullName || 'Người dùng ẩn danh'}</p>
                          <div className="flex text-vna-gold">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < rv.rating ? 'fill-current' : 'text-slate-300'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-slate-400">{new Date(rv.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <p className="text-slate-600">{rv.comment}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4 border-t border-slate-100 pt-6">
                <h3 className="font-bold text-slate-800">Viết đánh giá</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Đánh giá (sao)</label>
                  <select value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full border-slate-200 rounded-lg p-2 bg-slate-50">
                    <option value={5}>5 Sao - Tuyệt vời</option>
                    <option value={4}>4 Sao - Tốt</option>
                    <option value={3}>3 Sao - Tạm được</option>
                    <option value={2}>2 Sao - Không hài lòng</option>
                    <option value={1}>1 Sao - Rất tệ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nhận xét</label>
                  <Textarea value={comment} onChange={e => setComment(e.target.value)} required placeholder="Chia sẻ trải nghiệm của bạn..." className="bg-slate-50 min-h-[100px]" />
                </div>
                <Button type="submit" disabled={submitReview.isPending} className="bg-vna-blue text-white">
                  {submitReview.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
                </Button>
              </form>
            </section>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24 shadow-lg border-t-4 border-t-vna-gold rounded-xl">
              <CardContent className="p-6 rounded-xl">
                
                <div className="mb-6 pb-6 border-b">
                  <p className="text-slate-500 mb-1">Giá trọn gói từ</p>
                  <p className="text-3xl font-bold text-vna-blue mb-2">{data?.price?.toLocaleString('vi-VN') || '25.900.000'} ₫</p>
                  <p className="text-sm text-slate-500 flex items-center"><Calendar className="w-4 h-4 mr-1" /> Khởi hành: 15, 20, 25 hàng tháng</p>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="font-bold text-slate-800">Dịch vụ bao gồm:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5 shrink-0" /> Vé máy bay khứ hồi VNA (46kg hành lý)</li>
                    <li className="flex items-start text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5 shrink-0" /> Khách sạn 4* tiêu chuẩn quốc tế</li>
                    <li className="flex items-start text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5 shrink-0" /> Các bữa ăn theo chương trình</li>
                    <li className="flex items-start text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5 shrink-0" /> Visa du lịch & Bảo hiểm toàn cầu</li>
                  </ul>
                </div>

                <div className="space-y-3 mb-8">
                  <h4 className="font-bold text-slate-800">Không bao gồm:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start text-sm text-slate-600"><XCircle className="w-4 h-4 mr-2 text-red-400 mt-0.5 shrink-0" /> Chi phí cá nhân, mua sắm</li>
                    <li className="flex items-start text-sm text-slate-600"><XCircle className="w-4 h-4 mr-2 text-red-400 mt-0.5 shrink-0" /> Tiền tip cho HDV (7 USD/ngày)</li>
                  </ul>
                </div>

                <Button className="w-full h-14 text-lg bg-vna-gold hover:bg-vna-gold/90 text-white rounded-lg transition-all duration-300" onClick={handleBook} disabled={isBooking}>
                  {isBooking ? 'Đang xử lý...' : 'Yêu cầu tư vấn / Đặt Tour'}
                </Button>

              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
}




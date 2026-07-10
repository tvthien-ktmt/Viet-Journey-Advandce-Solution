import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Phone, Mail, MapPin, MessageSquare, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { contactApi } from '@/api/contact';
import { useMutation } from '@tanstack/react-query';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'contact',
  });

  const submitMutation = useMutation({
    mutationFn: (data: any) => contactApi.submitContact(data),
    onSuccess: () => {
      toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', type: 'contact' });
    },
    onError: () => toast.error('Có lỗi xảy ra, vui lòng thử lại sau.')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-vna-blue mb-4">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">Vietnam Airlines luôn sẵn sàng lắng nghe và hỗ trợ mọi yêu cầu của Quý khách 24/7.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-md bg-vna-blue text-white rounded-xl">
              <CardContent className="p-8 rounded-xl">
                <h3 className="text-xl font-bold mb-6">Trung tâm CSKH</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm mb-1">Gọi trong Việt Nam</p>
                      <p className="font-bold text-lg">1900 1100</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm mb-1">Gọi từ Nước ngoài</p>
                      <p className="font-bold text-lg">+84 24 38320320</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm mb-1">Email Hỗ trợ</p>
                      <p className="font-bold">telesales@vietnamairlines.com</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm mb-1">Giờ làm việc</p>
                      <p className="font-bold">24/7 (Cả dịp Lễ, Tết)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md rounded-xl">
              <CardContent className="p-8 rounded-xl">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-vna-gold" /> Trụ sở chính</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  200 Nguyễn Sơn, Phường Bồ Đề, Quận Long Biên, Hà Nội, Việt Nam.
                </p>
                <a href="#" className="text-vna-blue font-semibold text-sm hover:underline transition-all duration-300">Xem hệ thống phòng vé toàn quốc</a>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg h-full rounded-xl">
              <CardContent className="p-8 md:p-12 rounded-xl">
                <div className="flex items-center gap-3 mb-8">
                  <MessageSquare className="w-6 h-6 text-vna-blue" />
                  <h2 className="text-2xl font-bold text-slate-800">Gửi Yêu Cầu Hỗ Trợ</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Họ và Tên <span className="text-red-500">*</span></Label>
                      <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nguyễn Văn A" required className="h-12 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label>Địa chỉ Email <span className="text-red-500">*</span></Label>
                      <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" required className="h-12 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label>Số Điện Thoại <span className="text-red-500">*</span></Label>
                      <Input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0912345678" required className="h-12 rounded-lg" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Chủ đề <span className="text-red-500">*</span></Label>
                    <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required className="w-full h-12 px-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-vna-blue focus:border-transparent bg-white rounded-lg">
                      <option value="">Chọn chủ đề cần hỗ trợ</option>
                      <option value="book">Hỗ trợ đặt vé / Đổi ngày</option>
                      <option value="refund">Hoàn vé</option>
                      <option value="baggage">Vấn đề hành lý</option>
                      <option value="lotusmiles">Thẻ Bông Sen Vàng</option>
                      <option value="feedback">Góp ý dịch vụ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Nội dung chi tiết <span className="text-red-500">*</span></Label>
                    <textarea 
                      className="w-full min-h-[150px] p-4 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-vna-blue focus:border-transparent resize-none" 
                      placeholder="Xin vui lòng mô tả chi tiết vấn đề của Quý khách..."
                      required
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  <Button type="submit" size="lg" disabled={submitMutation.isPending} className="bg-vna-gold hover:bg-vna-gold/90 text-white px-10 h-14 text-base rounded-lg transition-all duration-300">
                    {submitMutation.isPending ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
                  </Button>
                </form>

              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
}


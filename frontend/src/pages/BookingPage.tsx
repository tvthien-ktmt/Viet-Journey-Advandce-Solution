import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const bookingSchema = z.object({
  contactName: z.string().min(1, 'Họ tên không được để trống'),
  contactPhone: z.string().min(10, 'SĐT không hợp lệ'),
  contactEmail: z.string().email('Email không hợp lệ'),
  pax1Name: z.string().min(1, 'Họ tên không được để trống'),
  pax1Dob: z.string().min(1, 'Ngày sinh không được để trống'),
  pax2Name: z.string().min(1, 'Họ tên không được để trống'),
  pax2Dob: z.string().min(1, 'Ngày sinh không được để trống'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const { register, trigger, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: 'onTouched'
  });

  const handleNext = async () => {
    if (currentStep === 1) {
      const isStep1Valid = await trigger(['contactName', 'contactPhone', 'contactEmail']);
      if (isStep1Valid) setCurrentStep(2);
      else toast.error('Vui lòng điền đầy đủ thông tin liên hệ');
    } else if (currentStep === 2) {
      const isStep2Valid = await trigger(['pax1Name', 'pax1Dob', 'pax2Name', 'pax2Dob']);
      if (isStep2Valid) navigate('/checkout');
      else toast.error('Vui lòng điền đầy đủ thông tin hành khách');
    }
  };

  const handlePrev = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col pt-[96px]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 w-full flex-grow flex flex-col pb-16">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-onSurface mb-2">Hoàn tất đặt chỗ</h1>
          <p className="text-[18px] text-onSurface-variant">Tour Khám Phá Sapa 3 Ngày 2 Đêm</p>
        </div>
        
        {/* Step Indicator */}
        <div className="relative max-w-3xl mx-auto mb-16 hidden md:block w-full">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[2px] bg-outline-variant -z-10">
            <div 
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
              style={{ width: currentStep === 1 ? '25%' : currentStep === 2 ? '75%' : '100%' }}
            ></div>
          </div>
          <div className="flex justify-between relative z-10">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-primary text-onPrimary border-primary`}>
                1
              </div>
              <span className={`text-[14px] font-semibold text-primary`}>Thông tin</span>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'bg-primary text-onPrimary border-primary' : 'bg-surface text-outline border-outline'}`}>
                2
              </div>
              <span className={`text-[14px] ${currentStep >= 2 ? 'font-semibold text-primary' : 'text-outline'}`}>Hành khách</span>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-surface text-outline border-outline`}>
                3
              </div>
              <span className={`text-[14px] text-outline`}>Thanh toán</span>
            </div>
            
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Booking Form */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {currentStep === 1 && (
              <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary text-[28px]">contact_mail</span>
                  <h2 className="text-[24px] font-bold text-onSurface">Thông tin liên hệ</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] text-onSurface-variant uppercase font-medium">Họ và tên *</label>
                    <input {...register('contactName')} type="text" className="w-full py-2 px-4 rounded-lg border border-outline-variant bg-surface text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Nguyễn Văn A" />
                    {errors.contactName && <span className="text-red-500 text-xs">{errors.contactName.message}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] text-onSurface-variant uppercase font-medium">Số điện thoại *</label>
                    <input {...register('contactPhone')} type="tel" className="w-full py-2 px-4 rounded-lg border border-outline-variant bg-surface text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="0912 345 678" />
                    {errors.contactPhone && <span className="text-red-500 text-xs">{errors.contactPhone.message}</span>}
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[12px] text-onSurface-variant uppercase font-medium">Email *</label>
                    <input {...register('contactEmail')} type="email" className="w-full py-2 px-4 rounded-lg border border-outline-variant bg-surface text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="example@email.com" />
                    {errors.contactEmail && <span className="text-red-500 text-xs">{errors.contactEmail.message}</span>}
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[12px] text-onSurface-variant uppercase font-medium">Yêu cầu đặc biệt</label>
                    <textarea className="w-full py-2 px-4 rounded-lg border border-outline-variant bg-surface text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" rows={3} placeholder="Ghi chú thêm cho chuyến đi..."></textarea>
                  </div>
                </div>
              </section>
            )}
            
            {currentStep === 2 && (
              <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[28px]">group</span>
                    <h2 className="text-[24px] font-bold text-onSurface">Thông tin hành khách</h2>
                  </div>
                  <span className="bg-surface-variant text-onSurface-variant px-2 py-1 rounded text-[14px] font-medium">2 Người lớn</span>
                </div>
                
                <div className="flex flex-col gap-8">
                  {/* Passenger 1 */}
                  <div className="pt-0">
                    <h4 className="text-[16px] font-semibold text-onSurface mb-4">Hành khách 1 (Người đại diện)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="flex flex-col gap-2 sm:col-span-1">
                        <label className="text-[12px] text-onSurface-variant uppercase font-medium">Danh xưng</label>
                        <select className="w-full py-2 px-4 rounded-lg border border-outline-variant bg-surface text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                          <option>Ông</option>
                          <option>Bà</option>
                          <option>Anh</option>
                          <option>Chị</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2 sm:col-span-2">
                        <label className="text-[12px] text-onSurface-variant uppercase font-medium">Họ và tên</label>
                        <input {...register('pax1Name')} type="text" className="w-full py-2 px-4 rounded-lg border border-outline-variant bg-surface text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Nhập họ tên" />
                        {errors.pax1Name && <span className="text-red-500 text-xs">{errors.pax1Name.message}</span>}
                      </div>
                      <div className="flex flex-col gap-2 sm:col-span-1">
                        <label className="text-[12px] text-onSurface-variant uppercase font-medium">Ngày sinh</label>
                        <input {...register('pax1Dob')} type="date" className="w-full py-2 px-4 rounded-lg border border-outline-variant bg-surface text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[14px]" />
                        {errors.pax1Dob && <span className="text-red-500 text-xs">{errors.pax1Dob.message}</span>}
                      </div>
                    </div>
                  </div>
                  
                  {/* Passenger 2 */}
                  <div className="pt-4 border-t border-outline-variant/30">
                    <h4 className="text-[16px] font-semibold text-onSurface mb-4">Hành khách 2</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="flex flex-col gap-2 sm:col-span-1">
                        <label className="text-[12px] text-onSurface-variant uppercase font-medium">Danh xưng</label>
                        <select className="w-full py-2 px-4 rounded-lg border border-outline-variant bg-surface text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                          <option>Bà</option>
                          <option>Ông</option>
                          <option>Anh</option>
                          <option>Chị</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2 sm:col-span-2">
                        <label className="text-[12px] text-onSurface-variant uppercase font-medium">Họ và tên</label>
                        <input {...register('pax2Name')} type="text" className="w-full py-2 px-4 rounded-lg border border-outline-variant bg-surface text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Nhập họ tên" />
                        {errors.pax2Name && <span className="text-red-500 text-xs">{errors.pax2Name.message}</span>}
                      </div>
                      <div className="flex flex-col gap-2 sm:col-span-1">
                        <label className="text-[12px] text-onSurface-variant uppercase font-medium">Ngày sinh</label>
                        <input {...register('pax2Dob')} type="date" className="w-full py-2 px-4 rounded-lg border border-outline-variant bg-surface text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[14px]" />
                        {errors.pax2Dob && <span className="text-red-500 text-xs">{errors.pax2Dob.message}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
            
            <div className="flex justify-between mt-4">
              {currentStep > 1 ? (
                <button 
                  onClick={handlePrev}
                  className="px-6 py-3 border border-outline text-primary font-medium rounded-lg flex items-center gap-2 hover:bg-surface-variant transition-colors text-[20px]"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Quay lại
                </button>
              ) : <div></div>}
              <button 
                onClick={handleNext}
                className="px-6 py-3 bg-primary text-onPrimary font-medium rounded-lg flex items-center gap-2 ml-auto hover:bg-primary-dark transition-colors text-[20px] shadow-sm"
              >
                Tiếp tục
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            
          </div>
          
          {/* Right Column: Order Summary */}
          <aside className="lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 overflow-hidden flex flex-col sticky top-28">
            {/* Cover Image */}
            <div className="relative h-48 w-full bg-surface-variant">
              <img src="/images/search_0_21b0e00f.jpg" alt="Sapa Tour" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-4">
                <span className="bg-primary/90 text-onPrimary text-[12px] font-bold uppercase tracking-wider px-2 py-1 rounded inline-block mb-1">Tour Trọn Gói</span>
                <h3 className="text-[20px] font-bold text-white">Khám Phá Sapa - Bản Cát Cát - Fansipan</h3>
              </div>
            </div>
            
            <div className="p-6 flex flex-col gap-6 flex-grow">
              {/* Key Details */}
              <div className="flex flex-col gap-2 pb-4 border-b border-outline-variant/30">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-outline text-[20px] mt-[2px]">calendar_month</span>
                  <div>
                    <p className="text-[14px] text-onSurface-variant">Khởi hành</p>
                    <p className="text-[16px] text-onSurface font-medium">15 Tháng 10, 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-outline text-[20px] mt-[2px]">schedule</span>
                  <div>
                    <p className="text-[14px] text-onSurface-variant">Thời gian</p>
                    <p className="text-[16px] text-onSurface font-medium">3 Ngày 2 Đêm</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-outline text-[20px] mt-[2px]">location_on</span>
                  <div>
                    <p className="text-[14px] text-onSurface-variant">Điểm đón</p>
                    <p className="text-[16px] text-onSurface font-medium">Hà Nội (Nhà Hát Lớn)</p>
                  </div>
                </div>
              </div>
              
              {/* Price Breakdown */}
              <div className="flex flex-col gap-2 pb-4 border-b border-outline-variant/30">
                <h4 className="text-[16px] font-semibold text-onSurface mb-1">Chi tiết giá</h4>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-onSurface-variant">Người lớn (x2)</span>
                  <span className="text-onSurface">3.500.000đ</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-onSurface-variant">Phụ thu cuối tuần</span>
                  <span className="text-onSurface">250.000đ</span>
                </div>
              </div>
              
              {/* Promo Code */}
              <div className="flex flex-col gap-2 pb-4 border-b border-outline-variant/30">
                <div className="flex gap-2">
                  <input type="text" className="flex-grow rounded-lg bg-surface border border-outline-variant p-2 text-[14px] focus:outline-none focus:border-primary" placeholder="Mã giảm giá" />
                  <button className="bg-surface-variant text-onSurface px-4 rounded-lg border-none cursor-pointer hover:bg-outline-variant transition-colors text-[14px]">Áp dụng</button>
                </div>
                <div className="flex justify-between items-center text-[14px] mt-2 text-success">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">local_offer</span> SUMMER24</span>
                  <span>-500.000đ</span>
                </div>
              </div>
              
              {/* Total */}
              <div className="mt-auto pt-2">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[16px] text-onSurface">Tổng thanh toán</span>
                  <span className="text-[32px] font-bold text-secondary-container leading-none">3.250.000đ</span>
                </div>
                <p className="text-[12px] text-outline text-right">Đã bao gồm thuế và phí</p>
              </div>
            </div>
          </aside>
          
          <div className="col-span-1 lg:col-span-12 flex justify-center gap-6 text-outline mt-4">
            <div className="flex items-center gap-1 text-[12px] font-medium uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">lock</span> Thanh toán an toàn
            </div>
            <div className="flex items-center gap-1 text-[12px] font-medium uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">support_agent</span> Hỗ trợ 24/7
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

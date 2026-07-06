import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const navigate = useNavigate();

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful checkout, redirect to a success page or booking detail
    // For now, let's just go back to home or a placeholder detail page
    navigate('/');
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      
      {/* Minimal Header */}
      <header className="h-20 border-b border-outline-variant/30 bg-surface-container-lowest flex items-center px-4 md:px-6 shrink-0">
        <div className="max-w-[1200px] w-full mx-auto flex justify-between items-center">
          <Link to="/" className="text-[20px] text-primary font-bold">VietJourney</Link>
          <div className="flex items-center gap-2 text-onSurface-variant">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            <span className="text-[14px]">Thanh toán an toàn</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] w-full mx-auto px-4 md:px-6 pt-8 pb-16 flex-grow">
        
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-outline-variant/30 -z-10"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-primary -z-10 transition-all duration-500"></div>
            
            {/* Steps */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-onPrimary">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <span className="text-[12px] text-onSurface-variant hidden md:block">Thông tin</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-onPrimary">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <span className="text-[12px] text-onSurface-variant hidden md:block">Hành khách</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-onPrimary">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <span className="text-[12px] text-onSurface-variant hidden md:block">Tiện ích</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-onPrimary ring-4 ring-primary-light font-bold">
                4
              </div>
              <span className="text-[12px] text-primary font-bold hidden md:block">Thanh toán</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-[32px] font-bold text-onSurface mb-8">Chọn phương thức thanh toán</h1>
        
        <form className="grid grid-cols-1 lg:grid-cols-12 gap-8" onSubmit={handleCheckout}>
          
          {/* Left Column: Payment Methods */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Credit Card */}
            <label className="block cursor-pointer relative group">
              <input 
                type="radio" 
                name="payment_method" 
                value="credit" 
                className="absolute w-1 h-1 p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0 clip-[rect(0,0,0,0)] rounded-lg" 
                checked={paymentMethod === 'credit'}
                onChange={() => setPaymentMethod('credit')}
              />
              <div className={`border-2 rounded-xl p-4 transition-colors ${paymentMethod === 'credit' ? 'border-primary bg-primary-light/30' : 'border-outline-variant bg-surface-container-lowest group-hover:border-primary-fixed-dim'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`material-symbols-outlined text-[24px] ${paymentMethod === 'credit' ? 'text-primary' : 'text-outline'}`} style={{ fontVariationSettings: paymentMethod === 'credit' ? "'FILL' 1" : "'FILL' 0" }}>credit_card</span>
                    <span className="text-[18px] font-semibold text-onSurface">Thẻ Tín dụng / Ghi nợ</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-10 h-6 bg-surface-variant rounded border border-outline-variant/30 flex items-center justify-center text-[8px] font-bold">VISA</div>
                    <div className="w-10 h-6 bg-surface-variant rounded border border-outline-variant/30 flex items-center justify-center text-[8px] font-bold">MC</div>
                  </div>
                </div>
                
                {paymentMethod === 'credit' && (
                  <div className="mt-4 pt-4 border-t border-outline-variant/30 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <span className="text-[12px] text-onSurface-variant block">Số thẻ</span>
                      <div className="relative">
                        <input type="text" className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 px-4 pr-11 text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="0000 0000 0000 0000" required maxLength={19} inputMode="numeric" />
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant">credit_score</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <span className="text-[12px] text-onSurface-variant block">Tên chủ thẻ</span>
                      <input type="text" className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 px-4 text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all uppercase" placeholder="NGUYEN VAN A" required minLength={2} />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] text-onSurface-variant block">Ngày hết hạn</span>
                      <input type="text" className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 px-4 text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="MM/YY" required pattern="(0[1-9]|1[0-2])\/\d{2}" />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] text-onSurface-variant block">CVV / CVC</span>
                      <div className="relative">
                        <input type="password" className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 px-4 pr-11 text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="123" required pattern="\d{3,4}" />
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant cursor-help" title="3 chữ số mặt sau thẻ">help</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </label>
            
            {/* Internet Banking */}
            <label className="block cursor-pointer relative group">
              <input 
                type="radio" 
                name="payment_method" 
                value="banking" 
                className="absolute w-1 h-1 p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0 clip-[rect(0,0,0,0)] rounded-lg" 
                checked={paymentMethod === 'banking'}
                onChange={() => setPaymentMethod('banking')}
              />
              <div className={`border-2 rounded-xl p-4 transition-colors ${paymentMethod === 'banking' ? 'border-primary bg-primary-light/30' : 'border-outline-variant bg-surface-container-lowest group-hover:border-primary-fixed-dim'}`}>
                <div className="flex items-center gap-4">
                  <span className={`material-symbols-outlined text-[24px] ${paymentMethod === 'banking' ? 'text-primary' : 'text-outline'}`} style={{ fontVariationSettings: paymentMethod === 'banking' ? "'FILL' 1" : "'FILL' 0" }}>account_balance</span>
                  <span className="text-[18px] font-semibold text-onSurface">Thẻ ATM / Internet Banking</span>
                </div>
              </div>
            </label>
            
            {/* E-wallet */}
            <label className="block cursor-pointer relative group">
              <input 
                type="radio" 
                name="payment_method" 
                value="wallet" 
                className="absolute w-1 h-1 p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0 clip-[rect(0,0,0,0)] rounded-lg" 
                checked={paymentMethod === 'wallet'}
                onChange={() => setPaymentMethod('wallet')}
              />
              <div className={`border-2 rounded-xl p-4 transition-colors ${paymentMethod === 'wallet' ? 'border-primary bg-primary-light/30' : 'border-outline-variant bg-surface-container-lowest group-hover:border-primary-fixed-dim'}`}>
                <div className="flex items-center gap-4">
                  <span className={`material-symbols-outlined text-[24px] ${paymentMethod === 'wallet' ? 'text-primary' : 'text-outline'}`} style={{ fontVariationSettings: paymentMethod === 'wallet' ? "'FILL' 1" : "'FILL' 0" }}>account_balance_wallet</span>
                  <span className="text-[18px] font-semibold text-onSurface">Ví điện tử MoMo / ZaloPay</span>
                </div>
              </div>
            </label>
            
            {/* QR Code */}
            <label className="block cursor-pointer relative group">
              <input 
                type="radio" 
                name="payment_method" 
                value="qr" 
                className="absolute w-1 h-1 p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0 clip-[rect(0,0,0,0)] rounded-lg" 
                checked={paymentMethod === 'qr'}
                onChange={() => setPaymentMethod('qr')}
              />
              <div className={`border-2 rounded-xl p-4 transition-colors ${paymentMethod === 'qr' ? 'border-primary bg-primary-light/30' : 'border-outline-variant bg-surface-container-lowest group-hover:border-primary-fixed-dim'}`}>
                <div className="flex items-center gap-4">
                  <span className={`material-symbols-outlined text-[24px] ${paymentMethod === 'qr' ? 'text-primary' : 'text-outline'}`} style={{ fontVariationSettings: paymentMethod === 'qr' ? "'FILL' 1" : "'FILL' 0" }}>qr_code_scanner</span>
                  <span className="text-[18px] font-semibold text-onSurface">Quét mã VNPAY-QR</span>
                </div>
              </div>
            </label>
            
          </div>
          
          {/* Right Column: Summary */}
          <div className="lg:col-span-4 relative">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden lg:sticky lg:top-24">
              
              {/* Booking Context */}
              <div className="bg-surface-container-low border-b border-outline-variant/30 p-6">
                <h2 className="text-[20px] font-bold text-onSurface mb-4">Chi tiết đặt chỗ</h2>
                
                <div className="flex gap-4 mb-4">
                  <img src="/images/search_0_707c4c46.jpg" alt="Halong Bay Tour" className="w-20 h-20 object-cover rounded-lg shrink-0" />
                  <div>
                    <h3 className="text-[16px] font-semibold text-onSurface line-clamp-2">Tour du thuyền Vịnh Hạ Long 2 ngày 1 đêm - Hạng Thương Gia</h3>
                    <div className="flex items-center gap-1 text-onSurface-variant mt-2">
                      <span className="material-symbols-outlined text-[16px]">star</span>
                      <span className="text-[14px] font-medium">4.9 (128 đánh giá)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 text-[14px] text-onSurface-variant">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] shrink-0">calendar_today</span>
                    <span>Khởi hành: 15/10/2024 - 16/10/2024</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] shrink-0">group</span>
                    <span>2 Người lớn, 1 Trẻ em</span>
                  </div>
                </div>
              </div>
              
              {/* Price Breakdown */}
              <div className="p-6 flex flex-col gap-4 text-[16px]">
                <div className="flex justify-between items-center text-onSurface-variant">
                  <span>Giá gốc</span>
                  <span>6,500,000 ₫</span>
                </div>
                <div className="flex justify-between items-center text-success">
                  <span>Ưu đãi thành viên (10%)</span>
                  <span>-650,000 ₫</span>
                </div>
                <div className="flex justify-between items-center text-onSurface-variant">
                  <span>Thuế & Phí dịch vụ</span>
                  <span>350,000 ₫</span>
                </div>
                
                <div className="border-t border-outline-variant/30 pt-4 mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[20px] font-bold text-onSurface">Tổng cộng</span>
                    <span className="text-[28px] font-bold text-primary">6,200,000 ₫</span>
                  </div>
                  <p className="text-[12px] text-onSurface-variant text-right">Đã bao gồm VAT</p>
                </div>
              </div>
              
              {/* CTA Action */}
              <div className="p-6 pt-0">
                <button type="submit" className="w-full bg-primary text-onPrimary py-3 px-4 rounded-lg flex justify-center items-center gap-2 hover:bg-primary-dark transition-colors shadow-md text-[20px] font-medium">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                  Thanh toán ngay
                </button>
                <p className="text-[12px] text-onSurface-variant mt-4 text-center">
                  Bằng việc thanh toán, bạn đồng ý với <Link to="/terms" className="text-primary underline">Điều khoản & Chính sách</Link> của VietJourney.
                </p>
              </div>
              
            </div>
          </div>
          
        </form>
      </main>
    </div>
  );
}

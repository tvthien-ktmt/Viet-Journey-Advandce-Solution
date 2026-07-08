
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '@/api/booking';
import type { BookingPassengerDTO } from '@/types/flight';

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingApi.get(id as string),
    enabled: !!id
  });

  const snapshot = booking?.itemSnapshot ? JSON.parse(booking.itemSnapshot) : null;

  return (
    <>
      <div className="flex flex-col flex-grow py-8 md:py-12">
        
        {/* Context Header & Breadcrumb */}
        <div className="mb-8">
          <Link to="/booking-history" className="hidden md:inline-flex items-center text-primary font-medium mb-6 hover:text-primary-dark transition-colors">
            <span className="material-symbols-outlined mr-2 transition-transform hover:-translate-x-1">arrow_back</span>
            Back to Booking History
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[12px] uppercase tracking-wider text-onSurface-variant">Booking ID</span>
                <span className="text-[16px] font-mono">#{id}</span>
              </div>
              <h1 className="text-[32px] md:text-[40px] font-bold text-onSurface">
                {snapshot?.from || snapshot?.name} {snapshot?.to ? `- ${snapshot.to}` : ''}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center gap-2 bg-success/15 text-primary-dark py-2 px-4 rounded-full border border-success/30 w-fit m-0">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-[12px] font-bold uppercase">{booking?.status || 'Confirmed'}</span>
              </div>
              <button onClick={() => window.print()} className="px-4 py-2 border border-outline rounded-lg text-[12px] font-medium flex items-center gap-1 hover:bg-surface-variant transition-colors bg-transparent">
                <span className="material-symbols-outlined text-[18px]">print</span>
                In vé
              </button>
            </div>
          </div>
        </div>

        {isLoading && <p className="text-center py-10">Đang tải thông tin booking...</p>}
        {isError && <p className="text-center py-10 text-red-500">Lỗi tải dữ liệu. Vui lòng thử lại sau.</p>}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Service Detail Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden flex flex-col sm:flex-row">
              <div className="relative h-48 w-full sm:w-2/5 sm:h-auto shrink-0">
                <img src={snapshot?.image || "/placeholder.svg"} alt="Booking Image" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-primary mb-2 text-[12px]">
                    <span className="material-symbols-outlined text-[18px]">{booking?.bookingType === 'HOTEL' ? 'hotel' : (booking?.bookingType === 'TOUR' ? 'tour' : 'flight')}</span>
                    <span>{booking?.bookingType} Booking</span>
                  </div>
                  <h3 className="text-[24px] font-bold text-onSurface mb-2">{snapshot?.flightNo || snapshot?.name || 'Booking'}</h3>
                  <div className="flex items-center text-onSurface-variant text-[14px] mb-4 gap-1">
                    <span className="material-symbols-outlined text-[18px]">info</span>
                    <span>{snapshot?.airline || snapshot?.location || 'Không có thông tin nhà cung cấp'}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-outline-variant/30">
                  <div>
                    <span className="block text-[12px] text-onSurface-variant mb-1">Thời gian khởi hành / nhận phòng</span>
                    <span className="block text-[14px] text-onSurface-variant">{snapshot?.departTime || snapshot?.checkIn || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[12px] text-onSurface-variant mb-1">Thời gian đến / trả phòng</span>
                    <span className="block text-[14px] text-onSurface-variant">{snapshot?.arriveTime || snapshot?.checkOut || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Info Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-6">
              <h4 className="flex items-center gap-2 text-[20px] font-bold text-onSurface mb-4">
                <span className="material-symbols-outlined text-primary">group</span>
                Guest Information
              </h4>
              
              <div className="flex flex-col gap-4">
                {booking?.passengers && booking.passengers.length > 0 ? booking.passengers.map((pax: BookingPassengerDTO, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined">person</span>
                      </div>
                      <div>
                        <p className="text-[16px] font-semibold text-onSurface">{pax.fullName}</p>
                        <p className="text-[14px] text-onSurface-variant">{pax.type || 'Adult'} {i === 0 ? '• Lead Guest' : ''}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant/10 text-onSurface-variant">
                    Không có thông tin hành khách.
                  </div>
                )}
              </div>
              
              {snapshot?.specialRequest && (
                <div className="mt-4 p-4 bg-secondary-container/30 border border-secondary-container/50 rounded-lg flex gap-2 items-start">
                  <span className="material-symbols-outlined text-secondary-container shrink-0 mt-[2px]">info</span>
                  <p className="text-[14px] text-onSecondary-fixed">{snapshot.specialRequest}</p>
                </div>
              )}
            </div>
            
          </div>

          {/* Right Column: Payment & Actions */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Payment Summary Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/20 p-6 sticky top-8">
              <h4 className="flex items-center gap-2 text-[20px] font-bold text-onSurface mb-6">
                <span className="material-symbols-outlined text-primary">receipt_long</span>
                Payment Summary
              </h4>
              
              {booking?.id && (
                <div className="flex justify-center items-center p-4 bg-white rounded-lg mb-6 border border-outline-variant/30">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VJ-${booking.id}&color=005454`} alt="QR Code" width={150} height={150} />
                </div>
              )}
              
              <div className="flex flex-col gap-2 text-[14px] text-onSurface-variant mb-6">
                <div className="flex justify-between items-center">
                  <span>Dịch vụ x {booking?.passengers?.length || 1}</span>
                  <span>{(booking?.totalPrice || 0)?.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-vna-red pt-4 border-t border-vna-border">
                <span>Tổng cộng</span>
                <span>{(booking?.totalPrice || 0).toLocaleString('vi-VN')} ₫</span>
              </div>
              </div>
              
              <div className="border-t border-outline-variant/30 pt-4 mb-6">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[16px] font-semibold text-onSurface">Total Amount</span>
                  <span className="text-[32px] font-bold text-primary tracking-tight leading-none">{(booking?.totalPrice || 0)?.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button className="w-full bg-primary text-onPrimary py-3 px-4 rounded-lg flex justify-center items-center gap-2 hover:bg-primary-dark transition-colors shadow-sm text-[16px] font-medium">
                  <span className="material-symbols-outlined text-[20px]">download</span>
                  Download Invoice
                </button>
                <button className="w-full bg-surface-container-low text-onSurface border border-outline py-3 px-4 rounded-lg flex justify-center items-center gap-2 hover:bg-surface-variant transition-colors shadow-sm text-[16px] font-medium">
                  <span className="material-symbols-outlined text-[20px]">support_agent</span>
                  Contact Support
                </button>
                <button className="w-full bg-transparent text-error py-2 px-4 rounded-lg flex justify-center items-center gap-2 hover:bg-error/10 transition-colors text-[14px] mt-1">
                  Cancel Booking
                </button>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
    </>
  );
}


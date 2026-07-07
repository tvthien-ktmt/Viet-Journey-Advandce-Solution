import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '@/api/booking';
import type { FlightBooking } from '@/types/flight';
import { useAuth } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';

export default function BookingHistoryPage() {
  const isAuthenticated = useAuth(s => s.isAuthenticated());
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res: any = await bookingApi.getMyBookings();
      return res.content || res.data?.content || [];
    },
    enabled: isAuthenticated
  });

  return (
    <>
      <div className="flex flex-col flex-grow py-8 md:py-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-bold text-vna-blue mb-2">Lịch sử đặt chỗ</h1>
            <p className="text-[18px] text-slate-600">Xem và quản lý các chuyến đi của bạn.</p>
          </div>
        </header>

        {/* Booking List */}
        {isLoading ? (
          <div className="text-center py-20">Đang tải dữ liệu...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500 mb-4">Bạn chưa có đặt chỗ nào.</p>
            <Link to="/" className="text-vna-gold hover:underline font-medium transition-all duration-300">Đặt chuyến đi mới ngay</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((b: FlightBooking) => (
              <article key={b.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-shadow hover:shadow-md flex flex-col sm:flex-row group">
                <div className="w-full sm:w-48 h-48 shrink-0 relative bg-slate-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[64px] text-vna-gold">
                    {b.bookingType === 'FLIGHT' ? 'flight' : b.bookingType === 'TOUR' ? 'tour' : 'hotel'}
                  </span>
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-vna-blue text-[12px] font-medium tracking-wider shadow-sm flex items-center gap-1 uppercase">
                    {b.bookingType === 'FLIGHT' ? 'Chuyến bay' : b.bookingType === 'TOUR' ? 'Tour' : 'Khách sạn'}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">Mã vé: BK{b.id}</span>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700">
                        {b.status}
                      </span>
                    </div>
                    <h3 className="text-[20px] font-bold text-slate-800 leading-tight mb-2">
                      {(() => {
                        try {
                          const snap = JSON.parse(b.itemSnapshot || '{}');
                          if (b.bookingType === 'FLIGHT') return `${snap.from || ''} → ${snap.to || ''}`;
                          return snap.name || b.bookingType;
                        } catch(e) {
                          return b.bookingType === 'FLIGHT' ? 'Vé máy bay' : b.bookingType === 'TOUR' ? 'Tour du lịch' : 'Khách sạn';
                        }
                      })()}
                    </h3>
                    <p className="flex items-center gap-2 text-[14px] text-slate-500 mt-2">
                      <span className="material-symbols-outlined text-[18px]">calendar_month</span> {b.createdAt ? new Date(b.createdAt).toLocaleDateString('vi-VN') : ''}
                    </p>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-slate-100 mt-auto">
                    <div>
                      <p className="text-[12px] text-slate-400 uppercase tracking-wider mb-1">Tổng tiền</p>
                      <p className="text-[20px] font-bold text-vna-gold">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.totalPrice || 0)}
                      </p>
                    </div>
                    <Link to={`/booking/${b.id}`} className="text-[14px] text-vna-blue flex items-center gap-1 font-medium hover:opacity-80 transition-opacity">
                      Chi tiết <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}


import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Khuyến mãi đặc biệt!', desc: 'Giảm 20% cho tour Vịnh Hạ Long.', time: '2 giờ trước', isRead: false },
    { id: 2, title: 'Xác nhận đặt phòng', desc: 'Khách sạn Melia Đà Nẵng đã xác nhận phòng của bạn.', time: '1 ngày trước', isRead: false },
    { id: 3, title: 'Nhắc nhở chuyến đi', desc: 'Chuyến bay của bạn sẽ cất cánh sau 24h nữa.', time: '3 ngày trước', isRead: true },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <MainLayout>
      <main className="flex-grow max-w-[800px] w-full mx-auto px-4 py-12 md:py-16">
        <div className="flex justify-between items-center mb-8 border-b border-outline-variant/30 pb-4">
          <h1 className="text-[32px] md:text-[40px] font-bold text-onSurface">Tất cả thông báo</h1>
          <button 
            onClick={markAllRead}
            className="px-4 py-2 border border-outline rounded-lg text-[14px] font-medium text-onSurface hover:bg-surface-container transition-colors"
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>
        
        <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm flex flex-col">
          {notifications.length > 0 ? (
            notifications.map((noti) => (
              <div 
                key={noti.id} 
                className={`p-4 md:p-6 border-b border-outline-variant/50 flex items-start gap-4 transition-colors last:border-b-0
                  ${noti.isRead ? 'bg-surface hover:bg-surface-container-lowest' : 'bg-primary-container/20 hover:bg-primary-container/40'}`}
              >
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${noti.isRead ? 'bg-transparent' : 'bg-primary'}`}></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-[16px] md:text-[18px] text-onSurface ${noti.isRead ? 'font-medium' : 'font-bold'}`}>{noti.title}</h3>
                    <span className="text-[12px] text-onSurface-variant whitespace-nowrap ml-4">{noti.time}</span>
                  </div>
                  <p className="text-[14px] text-onSurface-variant leading-relaxed">{noti.desc}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col justify-center items-center py-12 text-onSurface-variant gap-2">
              <span className="material-symbols-outlined text-[48px] opacity-20">notifications_off</span>
              <p>Bạn không có thông báo nào.</p>
            </div>
          )}
        </div>
      </main>
    </MainLayout>
  );
}

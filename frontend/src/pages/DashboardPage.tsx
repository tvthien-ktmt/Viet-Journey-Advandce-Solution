
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SidebarLayout from '../layouts/SidebarLayout';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <SidebarLayout>
      <div className="flex flex-col flex-grow py-8 md:py-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-bold text-onBackground mb-2">Xin chào, Nguyễn Văn A!</h1>
            <p className="text-[18px] text-onSurface-variant">Here is a summary of your travel activities.</p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-full shadow-sm hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-onSurface">notifications</span>
            </button>
          </div>
        </header>

        {/* Tab Navigation handled by SidebarLayout normally, but since the original had tab logic inside the dashboard page canvas, we will show only the Dashboard content for this route */}
        
        <div className="flex flex-col gap-8">
          
          {/* Stats Row */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-surface-variant flex flex-col justify-between hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-light text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">luggage</span>
                </div>
              </div>
              <div>
                <h3 className="text-[48px] md:text-[56px] font-bold text-onSurface leading-tight">12</h3>
                <p className="text-[12px] uppercase tracking-wider text-onSurface-variant">Chuyến đi</p>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-surface-variant flex flex-col justify-between hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent-light text-warning flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">stars</span>
                </div>
              </div>
              <div>
                <h3 className="text-[48px] md:text-[56px] font-bold text-onSurface leading-tight">4,500</h3>
                <p className="text-[12px] uppercase tracking-wider text-onSurface-variant">Điểm thưởng</p>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-surface-variant flex flex-col justify-between hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-info/10 text-info flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">reviews</span>
                </div>
              </div>
              <div>
                <h3 className="text-[48px] md:text-[56px] font-bold text-onSurface leading-tight">8</h3>
                <p className="text-[12px] uppercase tracking-wider text-onSurface-variant">Đánh giá</p>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-surface-variant flex flex-col justify-between hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-success/10 text-success flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">savings</span>
                </div>
              </div>
              <div>
                <h3 className="text-[48px] md:text-[56px] font-bold text-onSurface leading-tight">15%</h3>
                <p className="text-[12px] uppercase tracking-wider text-onSurface-variant">Tiết kiệm</p>
              </div>
            </div>
          </section>

          {/* Main Dashboard Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Upcoming Trip (Col Span 1) */}
            <section className="lg:col-span-1 flex flex-col gap-4">
              <h2 className="text-[24px] md:text-[28px] font-bold text-onSurface">Upcoming Trip</h2>
              
              <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden">
                <div className="h-32 relative">
                  <img src="/images/dashboard/img_2_6e8be19c.jpg" alt="Upcoming trip" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-[12px] text-primary font-medium tracking-wider uppercase">
                    In 14 Days
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-[20px] font-bold text-onSurface mb-1">2 Days 1 Night Ha Long Cruise</h3>
                  <p className="text-[14px] text-onSurface-variant flex items-center gap-1 mb-4">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    Ha Long Bay, Quang Ninh
                  </p>
                  
                  <div className="relative border-l-2 border-outline-variant ml-2 mt-4 pb-2">
                    <div className="relative pl-4 mb-4">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-surface-container-lowest"></div>
                      <p className="text-[12px] text-primary uppercase tracking-wider font-medium mb-1">OCT 15, 08:00 AM</p>
                      <p className="text-[14px] text-onSurface font-medium">Pickup at Hanoi Old Quarter</p>
                    </div>
                    <div className="relative pl-4 mb-4">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface-container-high border-2 border-outline-variant"></div>
                      <p className="text-[12px] text-onSurface-variant uppercase tracking-wider font-medium mb-1">OCT 15, 12:00 PM</p>
                      <p className="text-[14px] text-onSurface font-medium">Boarding Cruise & Lunch</p>
                    </div>
                    <div className="relative pl-4">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface-container-high border-2 border-outline-variant"></div>
                      <p className="text-[12px] text-onSurface-variant uppercase tracking-wider font-medium mb-1">OCT 16, 11:30 AM</p>
                      <p className="text-[14px] text-onSurface font-medium">Disembark & Return</p>
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 py-2 border border-outline rounded-lg text-primary font-bold hover:bg-primary-light/30 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
              
              <h2 className="text-[20px] font-bold text-onSurface mt-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button className="bg-surface-container-low border border-outline-variant p-2 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-surface-variant transition-colors h-24 cursor-pointer">
                  <span className="material-symbols-outlined text-primary">rate_review</span>
                  <span className="text-[14px] text-onSurface text-center">Write a Review</span>
                </button>
                <button className="bg-surface-container-low border border-outline-variant p-2 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-surface-variant transition-colors h-24 cursor-pointer">
                  <span className="material-symbols-outlined text-primary">confirmation_number</span>
                  <span className="text-[14px] text-onSurface text-center">My Vouchers</span>
                </button>
              </div>
            </section>

            {/* Right Column (Col Span 2) */}
            <section className="lg:col-span-2 flex flex-col gap-8">
              
              {/* Chart Placeholder */}
              <div>
                <h2 className="text-[20px] font-bold text-onSurface mb-4">Thống kê chi tiêu (Canvas)</h2>
                <div className="bg-surface border border-outline-variant rounded-md p-4 w-full flex items-center justify-center h-48 text-onSurface-variant text-[14px] italic">
                  [Chart Component Placeholder - Replace with actual canvas/chartjs]
                </div>
              </div>

              {/* Recent Bookings */}
              <div>
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-[24px] md:text-[28px] font-bold text-onSurface">Recent Bookings</h2>
                  <Link to="/booking-history" className="text-[14px] text-primary flex items-center gap-1 font-medium hover:underline transition-all duration-300">
                    View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
                
                <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr>
                          <th className="p-4 uppercase tracking-wider text-[12px] font-medium bg-surface-container-low border-b border-surface-variant text-onSurface-variant">ID</th>
                          <th className="p-4 uppercase tracking-wider text-[12px] font-medium bg-surface-container-low border-b border-surface-variant text-onSurface-variant">Loại</th>
                          <th className="p-4 uppercase tracking-wider text-[12px] font-medium bg-surface-container-low border-b border-surface-variant text-onSurface-variant">Điểm đến</th>
                          <th className="p-4 uppercase tracking-wider text-[12px] font-medium bg-surface-container-low border-b border-surface-variant text-onSurface-variant">Ngày</th>
                          <th className="p-4 uppercase tracking-wider text-[12px] font-medium bg-surface-container-low border-b border-surface-variant text-onSurface-variant">Giá</th>
                          <th className="p-4 uppercase tracking-wider text-[12px] font-medium bg-surface-container-low border-b border-surface-variant text-onSurface-variant">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="text-[14px]">
                        <tr className="hover:bg-surface-bright transition-colors cursor-pointer">
                          <td className="p-4 border-b border-surface-variant font-medium text-onSurface">#VJ-8924</td>
                          <td className="p-4 border-b border-surface-variant">
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary-light text-primary">
                              <span className="material-symbols-outlined text-[14px]">tour</span> Tour
                            </div>
                          </td>
                          <td className="p-4 border-b border-surface-variant text-onSurface">Trang An - Bai Dinh</td>
                          <td className="p-4 border-b border-surface-variant text-onSurface-variant">Sep 12, 2024</td>
                          <td className="p-4 border-b border-surface-variant font-medium text-onSurface">1,250,000 ₫</td>
                          <td className="p-4 border-b border-surface-variant">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-[12px] font-medium bg-success/10 text-success">Hoàn tất</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-surface-bright transition-colors cursor-pointer">
                          <td className="p-4 border-b border-surface-variant font-medium text-onSurface">#VJ-7531</td>
                          <td className="p-4 border-b border-surface-variant">
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-info/10 text-info">
                              <span className="material-symbols-outlined text-[14px]">hotel</span> Hotel
                            </div>
                          </td>
                          <td className="p-4 border-b border-surface-variant text-onSurface">Melia Danang Beach Resort</td>
                          <td className="p-4 border-b border-surface-variant text-onSurface-variant">Aug 05 - 08, 2024</td>
                          <td className="p-4 border-b border-surface-variant font-medium text-onSurface">8,400,000 ₫</td>
                          <td className="p-4 border-b border-surface-variant">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-[12px] font-medium bg-success/10 text-success">Hoàn tất</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-surface-bright transition-colors cursor-pointer">
                          <td className="p-4 border-b border-surface-variant font-medium text-onSurface">#VJ-6210</td>
                          <td className="p-4 border-b border-surface-variant">
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary-light text-primary">
                              <span className="material-symbols-outlined text-[14px]">tour</span> Tour
                            </div>
                          </td>
                          <td className="p-4 border-b border-surface-variant text-onSurface">Mekong Delta 1 Day</td>
                          <td className="p-4 border-b border-surface-variant text-onSurface-variant">Jul 22, 2024</td>
                          <td className="p-4 border-b border-surface-variant font-medium text-onSurface">850,000 ₫</td>
                          <td className="p-4 border-b border-surface-variant">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-[12px] font-medium bg-success/10 text-success">Hoàn tất</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-surface-bright transition-colors cursor-pointer">
                          <td className="p-4 border-b border-surface-variant font-medium text-onSurface">#VJ-5988</td>
                          <td className="p-4 border-b border-surface-variant">
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary-fixed/50 text-onSecondary-container">
                              <span className="material-symbols-outlined text-[14px]">flight</span> Flight
                            </div>
                          </td>
                          <td className="p-4 border-b border-surface-variant text-onSurface">HAN -&gt; SGN</td>
                          <td className="p-4 border-b border-surface-variant text-onSurface-variant">Jun 10, 2024</td>
                          <td className="p-4 border-b border-surface-variant font-medium text-onSurface">2,100,000 ₫</td>
                          <td className="p-4 border-b border-surface-variant">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-[12px] font-medium bg-success/10 text-success">Hoàn tất</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </section>
          </div>

        </div>
      </div>
    </SidebarLayout>
  );
}

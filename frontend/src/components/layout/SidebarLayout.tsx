import React from 'react';
import { NavLink } from 'react-router-dom';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0 pt-8 md:pt-12">
        <div className="sticky top-24 bg-surface border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
          <nav className="flex flex-col py-2">
            
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `flex items-center gap-3 px-6 py-4 text-[16px] font-medium transition-colors ${isActive ? 'bg-primary-container/20 text-primary border-l-4 border-primary' : 'text-onSurface-variant hover:bg-surface-container-low hover:text-primary border-l-4 border-transparent'}`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
              Tổng quan
            </NavLink>
            
            <NavLink 
              to="/profile" 
              className={({ isActive }) => `flex items-center gap-3 px-6 py-4 text-[16px] font-medium transition-colors ${isActive ? 'bg-primary-container/20 text-primary border-l-4 border-primary' : 'text-onSurface-variant hover:bg-surface-container-low hover:text-primary border-l-4 border-transparent'}`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              Hồ sơ cá nhân
            </NavLink>
            
            <NavLink 
              to="/booking-history" 
              className={({ isActive }) => `flex items-center gap-3 px-6 py-4 text-[16px] font-medium transition-colors ${isActive ? 'bg-primary-container/20 text-primary border-l-4 border-primary' : 'text-onSurface-variant hover:bg-surface-container-low hover:text-primary border-l-4 border-transparent'}`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
              Lịch sử đặt chỗ
            </NavLink>
            
            <NavLink 
              to="/wishlist" 
              className={({ isActive }) => `flex items-center gap-3 px-6 py-4 text-[16px] font-medium transition-colors ${isActive ? 'bg-primary-container/20 text-primary border-l-4 border-primary' : 'text-onSurface-variant hover:bg-surface-container-low hover:text-primary border-l-4 border-transparent'}`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              Mục yêu thích
            </NavLink>
            
            <NavLink 
              to="/notifications" 
              className={({ isActive }) => `flex items-center gap-3 px-6 py-4 text-[16px] font-medium transition-colors ${isActive ? 'bg-primary-container/20 text-primary border-l-4 border-primary' : 'text-onSurface-variant hover:bg-surface-container-low hover:text-primary border-l-4 border-transparent'}`}
            >
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></span>
              </div>
              Thông báo
            </NavLink>
            
            <NavLink 
              to="/settings" 
              className={({ isActive }) => `flex items-center gap-3 px-6 py-4 text-[16px] font-medium transition-colors ${isActive ? 'bg-primary-container/20 text-primary border-l-4 border-primary' : 'text-onSurface-variant hover:bg-surface-container-low hover:text-primary border-l-4 border-transparent'}`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
              Cài đặt
            </NavLink>
            
            <hr className="my-2 border-outline-variant/30" />
            
            <button className="flex items-center gap-3 px-6 py-4 text-[16px] font-medium text-error hover:bg-error/5 transition-colors border-l-4 border-transparent">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>logout</span>
              Đăng xuất
            </button>
            
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      {children}
    </div>
  );
}

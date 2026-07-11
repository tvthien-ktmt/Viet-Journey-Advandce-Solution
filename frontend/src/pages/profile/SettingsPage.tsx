import React, { useState } from 'react';
import { Card } from '@/components/ui';
import { useT, useLang } from '@/store/langStore';
import { useCurrency } from '@/store/currencyStore';
import { Globe, DollarSign, Moon, Type, Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const t = useT();
  const { lang, setLang } = useLang();
  const { currency, setCurrency } = useCurrency();
  const [theme, setTheme] = useState('light');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('md');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    promotions: true
  });

  const handleSave = () => {
    toast.success(t('Cài đặt đã được lưu thành công') || 'Cài đặt đã được lưu thành công');
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-vna-text mb-8">Cài đặt hệ thống</h1>

      <div className="space-y-6">
        {/* Language & Currency */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-vna-text mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Ngôn ngữ & Tiền tệ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Ngôn ngữ</label>
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as 'vn' | 'en')}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-vna-blue"
              >
                <option value="vn">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                Tiền tệ hiển thị
              </label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-vna-blue"
              >
                <option value="VND">VND - Việt Nam Đồng</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Theme & Accessibility */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-vna-text mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Giao diện & Trợ năng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Chủ đề (Theme)</label>
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-vna-blue"
              >
                <option value="light">Sáng (Light Mode)</option>
                <option value="dark">Tối (Dark Mode)</option>
                <option value="system">Tự động theo hệ thống</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                <Type className="w-4 h-4" />
                Kích thước chữ
              </label>
              <select 
                value={fontSize} 
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-vna-blue"
              >
                <option value="sm">Nhỏ (A-)</option>
                <option value="md">Tiêu chuẩn (A)</option>
                <option value="lg">Lớn (A+)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={highContrast} 
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="w-5 h-5 text-vna-blue rounded border-slate-300 focus:ring-vna-blue"
                />
                <span className="text-sm font-medium text-slate-700">Chế độ tương phản cao (High Contrast)</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-vna-text mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Thông báo
          </h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifications.email} 
                onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                className="w-5 h-5 text-vna-blue rounded border-slate-300 focus:ring-vna-blue"
              />
              <span className="text-sm font-medium text-slate-700">Nhận thông báo qua Email</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifications.sms} 
                onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                className="w-5 h-5 text-vna-blue rounded border-slate-300 focus:ring-vna-blue"
              />
              <span className="text-sm font-medium text-slate-700">Nhận thông báo SMS (Chỉ áp dụng thay đổi lịch bay)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifications.promotions} 
                onChange={(e) => setNotifications({...notifications, promotions: e.target.checked})}
                className="w-5 h-5 text-vna-blue rounded border-slate-300 focus:ring-vna-blue"
              />
              <span className="text-sm font-medium text-slate-700">Nhận thông tin khuyến mãi & ưu đãi</span>
            </label>
          </div>
        </Card>

        <div className="flex justify-end mt-8">
          <button 
            onClick={handleSave}
            className="px-6 py-3 bg-vna-blue text-white rounded-lg font-bold hover:bg-vna-dark transition-colors"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

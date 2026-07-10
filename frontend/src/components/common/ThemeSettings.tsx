import { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Monitor, Type, Contrast } from 'lucide-react';
import { Button } from '@/components/ui';

export function ThemeSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light'|'dark'|'system'>(
    (localStorage.getItem('theme') as 'light'|'dark'|'system') || 'system'
  );
  const [fontSize, setFontSize] = useState<'normal'|'large'>('normal');
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Theme
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem('theme', theme);

    // Font size
    if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }

    // Contrast
    if (highContrast) {
      root.style.filter = 'contrast(120%)';
    } else {
      root.style.filter = 'none';
    }
  }, [theme, fontSize, highContrast]);

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} title="Cài đặt giao diện & truy cập">
        <Settings size={20} className={isOpen ? 'animate-spin-slow' : ''} />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95">
          <h3 className="font-bold text-sm mb-3 text-slate-800">Giao diện (Theme)</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button variant={theme === 'light' ? 'default' : 'outline'} size="sm" onClick={() => setTheme('light')} className="flex flex-col gap-1 h-auto py-2">
              <Sun size={16} /> Light
            </Button>
            <Button variant={theme === 'dark' ? 'default' : 'outline'} size="sm" onClick={() => setTheme('dark')} className="flex flex-col gap-1 h-auto py-2">
              <Moon size={16} /> Dark
            </Button>
            <Button variant={theme === 'system' ? 'default' : 'outline'} size="sm" onClick={() => setTheme('system')} className="flex flex-col gap-1 h-auto py-2">
              <Monitor size={16} /> System
            </Button>
          </div>

          <h3 className="font-bold text-sm mb-3 text-slate-800 pt-4 border-t border-slate-100">Khả năng truy cập (A11y)</h3>
          <div className="space-y-2">
            <Button 
              variant={fontSize === 'large' ? 'default' : 'outline'} 
              size="sm" 
              className="w-full justify-start"
              onClick={() => setFontSize(f => f === 'normal' ? 'large' : 'normal')}
            >
              <Type size={16} className="mr-2" /> 
              {fontSize === 'normal' ? 'Tăng kích thước chữ' : 'Khôi phục cỡ chữ'}
            </Button>
            <Button 
              variant={highContrast ? 'default' : 'outline'} 
              size="sm" 
              className="w-full justify-start"
              onClick={() => setHighContrast(!highContrast)}
            >
              <Contrast size={16} className="mr-2" /> 
              {highContrast ? 'Tắt tương phản cao' : 'Bật tương phản cao'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

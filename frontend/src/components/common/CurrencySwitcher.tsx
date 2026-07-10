import { useState } from 'react';
import { Button } from '@/components/ui';
import { useCurrency } from '@/store/currencyStore';

const currencies = [
  { code: 'VND', symbol: '₫' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'JPY', symbol: '¥' }
];

export function CurrencySwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const currency = useCurrency((s) => s.currency);
  const setCurrency = useCurrency((s) => s.setCurrency);

  const handleSelect = (code: string) => {
    setCurrency(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="font-bold">
        {currency}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
          {currencies.map(c => (
            <button 
              key={c.code}
              onClick={() => handleSelect(c.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between ${currency === c.code ? 'text-vna-blue font-bold bg-slate-50' : ''}`}
            >
              <span>{c.code}</span>
              <span className="text-vna-muted">{c.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

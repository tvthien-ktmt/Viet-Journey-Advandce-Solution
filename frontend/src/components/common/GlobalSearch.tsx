import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Plane, Map, Tag, Newspaper } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { api } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';

export function GlobalSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        isOpen ? onClose() : document.dispatchEvent(new CustomEvent('open-global-search'));
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const { data: results, isLoading } = useQuery({
    queryKey: ['globalSearch', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return null;
      const res = await api.get(`/search?q=${debouncedQuery}`);
      return res;
    },
    enabled: debouncedQuery.length > 2
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center p-4 border-b border-vna-border">
          <Search className="text-vna-muted w-6 h-6 mr-3" />
          <input 
            type="text" 
            placeholder="Tìm chuyến bay, điểm đến, tin tức, khuyến mãi..." 
            className="flex-1 bg-transparent outline-none text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query && (
            <div className="p-8 text-center text-vna-muted">
              Gõ nội dung để tìm kiếm...
            </div>
          )}
          
          {isLoading && query.length > 2 && (
            <div className="p-8 text-center text-vna-muted animate-pulse">
              Đang tìm kiếm...
            </div>
          )}

          {results && (
            <div className="space-y-4 p-2">
              {results.flights?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-vna-muted uppercase tracking-wider mb-2 px-2">Chuyến bay</h3>
                  {results.flights.map((f: any) => (
                    <div 
                      key={f.id} 
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                      onClick={() => { navigate('/flights'); onClose(); }}
                    >
                      <div className="bg-blue-100 p-2 rounded-lg text-vna-blue"><Plane size={16} /></div>
                      <div>
                        <p className="font-medium text-sm">{f.flightNumber} ({f.departureAirport} - {f.arrivalAirport})</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {results.tours?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-vna-muted uppercase tracking-wider mb-2 px-2 mt-4">Tour & Điểm đến</h3>
                  {results.tours.map((t: any) => (
                    <div 
                      key={t.id} 
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                      onClick={() => { navigate(`/tours/${t.slug}`); onClose(); }}
                    >
                      <div className="bg-green-100 p-2 rounded-lg text-green-700"><Map size={16} /></div>
                      <div>
                        <p className="font-medium text-sm">{t.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tương tự cho blogs và promotions */}
              {!results.flights?.length && !results.tours?.length && (
                <div className="p-8 text-center text-vna-muted">
                  Không tìm thấy kết quả nào.
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 p-3 text-xs text-vna-muted flex justify-between border-t border-vna-border">
          <span>Sử dụng <kbd className="bg-white border rounded px-1 shadow-sm">↑</kbd> <kbd className="bg-white border rounded px-1 shadow-sm">↓</kbd> để di chuyển</span>
          <span>Sử dụng <kbd className="bg-white border rounded px-1 shadow-sm">ESC</kbd> để đóng</span>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Plane, Hotel, MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchApi } from '@/api/search';
import { useDebounce } from '@/hooks/useDebounce';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<{ tours: any[], hotels: any[], flights: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 500);
  const inputRef = useRef<HTMLInputElement>(null);
  const _navigate = useNavigate();

  useEffect(() => {
    let t: any;
    if (isOpen && inputRef.current) {
      t = setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setKeyword('');
      setResults(null);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedKeyword.trim()) {
        setResults(null);
        return;
      }
      try {
        setLoading(true);
        const res = await searchApi.global(debouncedKeyword);
        if (res.success) {
          setResults(res.data);
        }
      } catch (_error: any) {
        console.error('Search error:', _error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedKeyword]);

  const handleNavigate = (path: string) => {
    onClose();
    _navigate(path);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-0">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Area */}
        <div className="relative flex items-center p-4 border-b border-slate-100">
          <Search className="w-6 h-6 text-slate-400 absolute left-6" />
          <input
            ref={inputRef}
            type="text"
            className="w-full pl-12 pr-12 py-3 text-lg bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
            placeholder="Tìm kiếm chuyến bay, khách sạn, tour..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword && (
            <button 
              onClick={() => setKeyword('')}
              className="absolute right-14 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="absolute right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors bg-slate-50 border border-slate-200"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider">Esc</span>
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto flex-1 p-2">
          {!keyword.trim() ? (
            <div className="p-8 text-center text-slate-500">
              <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p>Nhập từ khóa để tìm kiếm các dịch vụ của VietJourney</p>
            </div>
          ) : loading ? (
            <div className="p-12 flex justify-center items-center text-vna-blue">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : results ? (
            <div className="space-y-6 p-4">
              {/* Flights */}
              {results.flights && results.flights.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                    <Plane className="w-4 h-4" /> Chuyến bay
                  </h3>
                  <div className="space-y-1">
                    {results.flights.map((flight) => (
                      <button
                        key={flight.id}
                        onClick={() => handleNavigate('/flights')}
                        className="w-full text-left px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-3 group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-vna-blue flex items-center justify-center shrink-0">
                          <Plane className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-700 group-hover:text-vna-blue transition-colors">
                            {flight.departureAirport} → {flight.arrivalAirport}
                          </div>
                          <div className="text-xs text-slate-500">
                            Chuyến bay {flight.flightNumber} • {flight.airlineCode}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hotels */}
              {results.hotels && results.hotels.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                    <Hotel className="w-4 h-4" /> Khách sạn
                  </h3>
                  <div className="space-y-1">
                    {results.hotels.map((hotel) => (
                      <button
                        key={hotel.id}
                        onClick={() => handleNavigate(`/hotel/${hotel.id}`)}
                        className="w-full text-left px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-3 group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 overflow-hidden">
                          {hotel.image ? (
                            <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                          ) : (
                            <Hotel className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-700 group-hover:text-vna-blue transition-colors">
                            {hotel.name}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1">
                            {hotel.location}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tours */}
              {results.tours && results.tours.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Tours
                  </h3>
                  <div className="space-y-1">
                    {results.tours.map((tour) => (
                      <button
                        key={tour.id}
                        onClick={() => handleNavigate(`/tours/${tour.slug || tour.id}`)}
                        className="w-full text-left px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-3 group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0 overflow-hidden">
                           {tour.image ? (
                            <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                          ) : (
                            <MapPin className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-700 group-hover:text-vna-blue transition-colors">
                            {tour.name}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1">
                            {tour.location}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {results.flights?.length === 0 && results.hotels?.length === 0 && results.tours?.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <p>Không tìm thấy kết quả nào phù hợp với "{keyword}"</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 p-3 text-center border-t border-slate-100 text-xs text-slate-500 flex justify-center items-center gap-4">
          <span className="flex items-center gap-1"><kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">↑</kbd> <kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">↓</kbd> để di chuyển</span>
          <span className="flex items-center gap-1"><kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">Enter</kbd> để chọn</span>
          <span className="flex items-center gap-1"><kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">Esc</kbd> để đóng</span>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FlightsPage() {
  const [activeTab, setActiveTab] = useState('Khứ hồi');
  const [origin, setOrigin] = useState('Hà Nội (HAN)');
  const [dest, setDest] = useState('');
  const [departDate, setDepartDate] = useState('15/11/2025');
  const [returnDate, setReturnDate] = useState('22/11/2025');
  const [destError, setDestError] = useState(false);
  const [departError, setDepartError] = useState(false);
  const [returnError, setReturnError] = useState(false);
  
  const _navigate = useNavigate();

  const handleSwap = () => {
    const temp = origin;
    setOrigin(dest);
    setDest(temp);
  };

  const handleSearch = () => {
    let hasError = false;
    
    if (!dest.trim()) {
      setDestError(true);
      hasError = true;
    } else {
      setDestError(false);
    }

    const parseDate = (str: string) => {
      const parts = str.split('/');
      if (parts.length !== 3) return null;
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    };

    const departParsed = parseDate(departDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (departParsed && departParsed < today) {
      setDepartError(true);
      hasError = true;
      // In a real app, we would show a toast here
    } else {
      setDepartError(false);
    }

    if (activeTab !== 'Một chiều' && returnDate.trim()) {
      const returnParsed = parseDate(returnDate);
      if (departParsed && returnParsed && returnParsed <= departParsed) {
        setReturnError(true);
        hasError = true;
        // In a real app, we would show a toast here
      } else {
        setReturnError(false);
      }
    }

    if (!hasError) {
      sessionStorage.setItem('vj_flight_search', JSON.stringify({
        origin, dest, departDate, returnDate: activeTab === 'Một chiều' ? '' : returnDate
      }));
      _navigate('/flights/results');
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 w-full pt-8 pb-16 flex-grow flex flex-col">
      
      <div className="mb-8">
        <h1 className="text-[40px] font-bold text-primary-dark">Tìm kiếm chuyến bay</h1>
      </div>
      
      {/* Search Section */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-outline-variant relative z-10 mb-16">
        
        {/* Flight Type Tabs */}
        <div className="flex gap-4 border-b border-outline-variant mb-4 overflow-x-auto">
          {['Khứ hồi', 'Một chiều', 'Nhiều chặng'].map(tab => (
            <button 
              key={tab}
              className={`pb-2 font-medium text-[16px] whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'text-primary border-primary' 
                  : 'text-onSurface-variant border-transparent hover:text-primary'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Search Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          
          {/* Origin & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center md:items-end lg:col-span-5">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-onSurface-variant uppercase font-medium">Điểm đi</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline pointer-events-none">flight_takeoff</span>
                <input 
                  type="text" 
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  className="w-full py-3 pl-11 pr-3 rounded-lg border border-outline-variant bg-surface-container text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all truncate" 
                />
              </div>
            </div>
            
            <button 
              onClick={handleSwap}
              className="w-10 h-10 bg-surface-container-lowest rounded-full shadow-md border border-outline-variant flex items-center justify-center text-primary cursor-pointer z-10 hover:bg-surface-container transition-colors mx-auto md:mb-1 group"
            >
              <span className="material-symbols-outlined transition-transform duration-300 group-hover:rotate-180">swap_horiz</span>
            </button>
            
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-onSurface-variant uppercase font-medium">Điểm đến</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline pointer-events-none">flight_land</span>
                <input 
                  type="text" 
                  value={dest}
                  onChange={e => {
                    setDest(e.target.value);
                    if (destError) setDestError(false);
                  }}
                  placeholder="Thành phố hoặc sân bay"
                  className={`w-full py-3 pl-11 pr-3 rounded-lg border ${destError ? 'border-error' : 'border-outline-variant'} bg-surface-container text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all truncate`}
                />
              </div>
            </div>
          </div>
          
          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:col-span-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-onSurface-variant uppercase font-medium">Ngày đi</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline pointer-events-none">calendar_today</span>
                <input 
                  type="text" 
                  value={departDate}
                  onChange={e => {
                    setDepartDate(e.target.value);
                    if (departError) setDepartError(false);
                  }}
                  className={`w-full py-3 pl-11 pr-3 rounded-lg border ${departError ? 'border-error' : 'border-outline-variant'} bg-surface-container text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all truncate cursor-pointer`}
                />
              </div>
            </div>
            
            {activeTab !== 'Một chiều' && (
              <div className="flex flex-col gap-1">
                <label className="text-[12px] text-onSurface-variant uppercase font-medium">Ngày về</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline pointer-events-none">calendar_today</span>
                  <input 
                    type="text" 
                    value={returnDate}
                    onChange={e => {
                      setReturnDate(e.target.value);
                      if (returnError) setReturnError(false);
                    }}
                    className={`w-full py-3 pl-11 pr-3 rounded-lg border ${returnError ? 'border-error' : 'border-outline-variant'} bg-surface-container text-onSurface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all truncate cursor-pointer`}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Passengers & Class */}
          <div className="flex flex-col gap-1 lg:col-span-3">
            <label className="text-[12px] text-onSurface-variant uppercase font-medium">Hành khách & Hạng ghế</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline pointer-events-none">person</span>
              <button className="w-full py-3 pl-11 pr-3 rounded-lg border border-outline-variant bg-surface-container text-onSurface flex justify-between items-center text-left focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                <span className="truncate">1 Người lớn, Phổ thông</span>
                <span className="material-symbols-outlined text-outline">arrow_drop_down</span>
              </button>
            </div>
          </div>
          
          {/* Search Button */}
          <div className="flex items-end h-full lg:col-span-1">
            <button 
              onClick={handleSearch}
              className="w-full h-[50px] bg-secondary-container text-onSecondary-container rounded-lg border-none shadow-md flex items-center justify-center cursor-pointer hover:bg-secondary-fixed-dim transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
          </div>
          
        </div>
      </section>
      
      {/* Popular Routes & Tips */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Popular Routes */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <h2 className="text-[28px] font-bold text-primary">Chặng bay phổ biến</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Route Card 1 */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-outline-variant p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow group">
              <div className="w-16 h-16 rounded-lg bg-primary-light text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-onPrimary transition-colors">
                <span className="material-symbols-outlined text-[32px]">flight</span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="text-[20px] font-semibold text-onSurface">Hà Nội (HAN)</span>
                  <span className="material-symbols-outlined text-outline-variant text-[14px]">arrow_forward</span>
                  <span className="text-[20px] font-semibold text-onSurface">TP.HCM (SGN)</span>
                </div>
                <p className="text-[14px] text-onSurface-variant mt-1">Từ 1.200.000đ • Khứ hồi</p>
              </div>
            </div>
            
            {/* Route Card 2 */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-outline-variant p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow group">
              <div className="w-16 h-16 rounded-lg bg-primary-light text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-onPrimary transition-colors">
                <span className="material-symbols-outlined text-[32px]">flight</span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="text-[20px] font-semibold text-onSurface">Hà Nội (HAN)</span>
                  <span className="material-symbols-outlined text-outline-variant text-[14px]">arrow_forward</span>
                  <span className="text-[20px] font-semibold text-onSurface">Đà Nẵng (DAD)</span>
                </div>
                <p className="text-[14px] text-onSurface-variant mt-1">Từ 850.000đ • Khứ hồi</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tips Sidebar */}
        <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant flex flex-col gap-4 lg:col-span-1">
          <h3 className="text-[20px] font-semibold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            Mẹo săn vé giá rẻ
          </h3>
          <ul className="flex flex-col gap-3">
            <li className="flex gap-2">
              <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">check_circle</span>
              <span className="text-[14px] text-onSurface-variant">Đặt vé trước từ 1-2 tháng để có giá tốt nhất.</span>
            </li>
            <li className="flex gap-2">
              <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">check_circle</span>
              <span className="text-[14px] text-onSurface-variant">Linh hoạt ngày bay (+/- 3 ngày) có thể giúp tiết kiệm đáng kể.</span>
            </li>
            <li className="flex gap-2">
              <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">check_circle</span>
              <span className="text-[14px] text-onSurface-variant">Bay vào giữa tuần thường rẻ hơn cuối tuần.</span>
            </li>
          </ul>
        </div>
        
      </section>
      
    </div>
  );
}

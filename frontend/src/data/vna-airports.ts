export const AIRPORTS = [
  { code: 'HAN', city: 'Hà Nội', name: 'Sân bay QT Nội Bài', country: 'VN' },
  { code: 'SGN', city: 'TP. Hồ Chí Minh', name: 'Sân bay QT Tân Sơn Nhất', country: 'VN' },
  { code: 'DAD', city: 'Đà Nẵng', name: 'Sân bay QT Đà Nẵng', country: 'VN' },
  { code: 'PQC', city: 'Phú Quốc', name: 'Sân bay QT Phú Quốc', country: 'VN' },
  { code: 'HPH', city: 'Hải Phòng', name: 'Sân bay QT Cát Bi', country: 'VN' },
  { code: 'CXR', city: 'Nha Trang', name: 'Sân bay QT Cam Ranh', country: 'VN' },
  { code: 'HUI', city: 'Huế', name: 'Sân bay Phú Bài', country: 'VN' },
  { code: 'VCA', city: 'Cần Thơ', name: 'Sân bay QT Cần Thơ', country: 'VN' },
  { code: 'DLK', city: 'Đà Lạt', name: 'Sân bay Liên Khương', country: 'VN' },
  { code: 'VDO', city: 'Vân Đồn', name: 'Sân bay QT Vân Đồn', country: 'VN' },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi', country: 'TH' },
  { code: 'SIN', city: 'Singapore', name: 'Changi', country: 'SG' },
  { code: 'ICN', city: 'Seoul', name: 'Incheon', country: 'KR' },
  { code: 'NRT', city: 'Tokyo', name: 'Narita', country: 'JP' },
  { code: 'PEK', city: 'Bắc Kinh', name: 'Capital', country: 'CN' },
  { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith', country: 'AU' },
  { code: 'LHR', city: 'London', name: 'Heathrow', country: 'GB' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle', country: 'FR' },
  { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt', country: 'DE' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai', country: 'AE' },
] as const;

export type Airport = typeof AIRPORTS[number];

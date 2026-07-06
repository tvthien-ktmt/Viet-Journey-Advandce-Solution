export const ADMIN_STATS = {
  kpi: {
    totalRevenue: 12840000000,
    totalBookings: 3421,
    totalFlights: 287,
    loadFactor: 78,
    trends: { revenue: 12, bookings: 8, flights: 5, loadFactor: 3 },
  },
  revenueByMonth: [
    { month: 'T1', revenue: 850000000 }, { month: 'T2', revenue: 920000000 },
    { month: 'T3', revenue: 1100000000 }, { month: 'T4', revenue: 1050000000 },
    { month: 'T5', revenue: 1200000000 }, { month: 'T6', revenue: 1350000000 },
    { month: 'T7', revenue: 1500000000 }, { month: 'T8', revenue: 1480000000 },
    { month: 'T9', revenue: 1300000000 }, { month: 'T10', revenue: 1180000000 },
    { month: 'T11', revenue: 1250000000 }, { month: 'T12', revenue: 1660000000 },
  ],
  bookingsByRoute: [
    { route: 'HAN-SGN', count: 845 }, { route: 'SGN-DAD', count: 612 },
    { route: 'HAN-DAD', count: 487 }, { route: 'SGN-PQC', count: 392 },
    { route: 'HAN-CXR', count: 318 },
  ],
  cabinDistribution: [
    { name: 'Phổ thông', value: 2450 },
    { name: 'PT đặc biệt', value: 580 },
    { name: 'Thương gia', value: 320 },
    { name: 'Thương nhân', value: 71 },
  ],
  loadFactorByMonth: [
    { month: 'T1', factor: 65 }, { month: 'T2', factor: 68 }, { month: 'T3', factor: 72 },
    { month: 'T4', factor: 70 }, { month: 'T5', factor: 75 }, { month: 'T6', factor: 80 },
    { month: 'T7', factor: 85 }, { month: 'T8', factor: 83 }, { month: 'T9', factor: 78 },
    { month: 'T10', factor: 74 }, { month: 'T11', factor: 76 }, { month: 'T12', factor: 82 },
  ],
  flights: [
    { id: '1', flightNo: 'VN201', from: 'HAN', to: 'SGN', departDate: '2025-06-15', departTime: '06:00', aircraft: 'Airbus A321neo', basePrice: 1290000, status: 'ACTIVE' },
    { id: '2', flightNo: 'VN205', from: 'HAN', to: 'SGN', departDate: '2025-06-15', departTime: '09:30', aircraft: 'Airbus A321neo', basePrice: 1350000, status: 'ACTIVE' },
    { id: '3', flightNo: 'VN209', from: 'HAN', to: 'SGN', departDate: '2025-06-15', departTime: '14:00', aircraft: 'Boeing 787-9', basePrice: 1490000, status: 'DELAYED' },
    { id: '4', flightNo: 'VN301', from: 'SGN', to: 'DAD', departDate: '2025-06-15', departTime: '07:15', aircraft: 'Airbus A321neo', basePrice: 1190000, status: 'CANCELLED' },
  ],
  bookings: [
    { id: 'B1', bookingCode: 'VNA123', contactEmail: 'nguyen.van.a@example.com', route: 'HAN-SGN', date: '2025-06-15', amount: 3500000, status: 'CONFIRMED' },
    { id: 'B2', bookingCode: 'VNA124', contactEmail: 'tran.thi.b@example.com', route: 'SGN-DAD', date: '2025-06-16', amount: 1200000, status: 'HOLD' },
    { id: 'B3', bookingCode: 'VNA125', contactEmail: 'le.van.c@example.com', route: 'HAN-PQC', date: '2025-06-17', amount: 4500000, status: 'EXPIRED' },
    { id: 'B4', bookingCode: 'VNA126', contactEmail: 'pham.thi.d@example.com', route: 'DAD-SGN', date: '2025-06-18', amount: 1100000, status: 'PENDING_PAYMENT' },
  ],
  users: [
    { id: 'U1', email: 'admin@vietnamairlines.com', fullName: 'System Admin', roles: ['ADMIN', 'USER'], lotusmilesTier: 'Platinum' },
    { id: 'U2', email: 'user@example.com', fullName: 'Nguyen Van User', roles: ['USER'], lotusmilesTier: 'Titanium' },
    { id: 'U3', email: 'guest@example.com', fullName: 'Guest User', roles: ['USER'], lotusmilesTier: 'Ocean' },
  ]
};

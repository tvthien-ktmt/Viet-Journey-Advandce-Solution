export interface Kpi {
  totalRevenue: number;
  totalBookings: number;
  totalFlights: number;
  loadFactor: number;
  trends: {
    revenue: number;
    bookings: number;
    flights: number;
    loadFactor: number;
  };
  revenueByMonth?: ChartDataPoint[];
  bookingsByRoute?: ChartDataPoint[];
  cabinDistribution?: ChartDataPoint[];
  loadFactorByMonth?: ChartDataPoint[];
}

export interface AdminFlight {
  id: string;
  flightNo: string;
  from: string;
  to: string;
  departDate: string;
  departTime: string;
  aircraft: string;
  basePrice: number;
  status: string;
}

export interface AdminBooking {
  id: string;
  bookingCode: string;
  contactEmail: string;
  route: string;
  date: string;
  amount: number;
  status: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  lotusmilesTier: string;
}

export interface ChartDataPoint {
  month?: string;
  name?: string;
  revenue?: number;
  bookings?: number;
  value?: number;
  economy?: number;
  business?: number;
  factor?: number;
  route?: string;
  count?: number;
}

export interface AdminNews {
  id: string;
  title: string;
  category: string;
  status: string;
  date: string;
  slug: string;
}

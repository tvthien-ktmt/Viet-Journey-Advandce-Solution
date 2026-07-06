import { api } from './client';
import { ADMIN_STATS } from './mocks/admin';
import type { AdminFlight, AdminBooking, AdminUser, Kpi, ChartDataPoint, AdminNews } from '../types/admin';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || false;

export const adminApi = {
  stats: {
    revenue: (year: number): Promise<ChartDataPoint[]> => USE_MOCK ? Promise.resolve(ADMIN_STATS.revenueByMonth as any) : api.get('/admin/stats/revenue', { year }),
    bookingsByRoute: (): Promise<ChartDataPoint[]> => USE_MOCK ? Promise.resolve(ADMIN_STATS.bookingsByRoute as any) : api.get('/admin/stats/bookings-by-route'),
    cabin: (): Promise<ChartDataPoint[]> => USE_MOCK ? Promise.resolve(ADMIN_STATS.cabinDistribution as any) : api.get('/admin/stats/cabin-distribution'),
    loadFactor: (year: number): Promise<ChartDataPoint[]> => USE_MOCK ? Promise.resolve(ADMIN_STATS.loadFactorByMonth as any) : api.get('/admin/stats/load-factor', { year }),
    kpi: (): Promise<Kpi> => USE_MOCK ? Promise.resolve(ADMIN_STATS.kpi as any) : api.get('/admin/stats/kpi'),
  },
  flights: {
    list: (): Promise<AdminFlight[]> => USE_MOCK ? Promise.resolve((ADMIN_STATS.flights || []) as any) : api.get('/admin/flights'),
    create: (data: Partial<AdminFlight>): Promise<AdminFlight> => USE_MOCK ? Promise.resolve({ ...data, id: Date.now().toString() } as any) : api.post('/admin/flights', data),
    update: (id: string, data: Partial<AdminFlight>): Promise<AdminFlight> => USE_MOCK ? Promise.resolve({ ...data, id } as AdminFlight) : api.put(`/admin/flights/${id}`, data),
    delete: (id: string): Promise<{ success: boolean }> => USE_MOCK ? Promise.resolve({ success: true }) : api.delete(`/admin/flights/${id}`),
  },
  bookings: { 
    list: (): Promise<AdminBooking[]> => USE_MOCK ? Promise.resolve((ADMIN_STATS.bookings || []) as any) : api.get('/admin/bookings') 
  },
  users: { 
    list: (): Promise<AdminUser[]> => USE_MOCK ? Promise.resolve((ADMIN_STATS.users || []) as any) : api.get('/admin/users'),
    updateRole: (id: string, roles: string[]): Promise<{ success: boolean }> => USE_MOCK ? Promise.resolve({ success: true }) : api.put(`/admin/users/${id}/roles`, roles)
  },
  news: {
    list: (): Promise<AdminNews[]> => USE_MOCK ? Promise.resolve([]) : api.get('/admin/news'),
    create: (data: Partial<AdminNews>): Promise<AdminNews> => USE_MOCK ? Promise.resolve({ ...data, id: Date.now().toString() } as AdminNews) : api.post('/admin/news', data),
    delete: (id: string): Promise<{ success: boolean }> => USE_MOCK ? Promise.resolve({ success: true }) : api.delete(`/admin/news/${id}`),
  },
};

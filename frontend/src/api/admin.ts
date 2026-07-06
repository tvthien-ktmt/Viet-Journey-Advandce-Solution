import { api } from './client';
import { ADMIN_STATS } from './mocks/admin';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || false;

export const adminApi = {
  stats: {
    revenue: (year: number): Promise<any> => USE_MOCK ? Promise.resolve(ADMIN_STATS.revenueByMonth) : api.get('/admin/stats/revenue', { year }),
    bookingsByRoute: (): Promise<any> => USE_MOCK ? Promise.resolve(ADMIN_STATS.bookingsByRoute) : api.get('/admin/stats/bookings-by-route'),
    cabin: (): Promise<any> => USE_MOCK ? Promise.resolve(ADMIN_STATS.cabinDistribution) : api.get('/admin/stats/cabin-distribution'),
    loadFactor: (year: number): Promise<any> => USE_MOCK ? Promise.resolve(ADMIN_STATS.loadFactorByMonth) : api.get('/admin/stats/load-factor', { year }),
    kpi: (): Promise<any> => USE_MOCK ? Promise.resolve(ADMIN_STATS.kpi) : api.get('/admin/stats/kpi'),
  },
  flights: {
    list: (): Promise<any> => USE_MOCK ? Promise.resolve(ADMIN_STATS.flights || []) : api.get('/admin/flights'),
    create: (data: any): Promise<any> => USE_MOCK ? Promise.resolve({ ...data, id: Date.now().toString() }) : api.post('/admin/flights', data),
    update: (id: string, data: any): Promise<any> => USE_MOCK ? Promise.resolve({ ...data, id }) : api.put(`/admin/flights/${id}`, data),
    delete: (id: string): Promise<any> => USE_MOCK ? Promise.resolve({ success: true }) : api.delete(`/admin/flights/${id}`),
  },
  bookings: { 
    list: (): Promise<any> => USE_MOCK ? Promise.resolve(ADMIN_STATS.bookings || []) : api.get('/admin/bookings') 
  },
  users: { 
    list: (): Promise<any> => USE_MOCK ? Promise.resolve(ADMIN_STATS.users || []) : api.get('/admin/users'),
    updateRole: (id: string, roles: string[]): Promise<any> => USE_MOCK ? Promise.resolve({ success: true }) : api.put(`/admin/users/${id}/roles`, roles)
  },
  news: {
    list: (): Promise<any> => USE_MOCK ? Promise.resolve([]) : api.get('/admin/news'),
    create: (data: any): Promise<any> => USE_MOCK ? Promise.resolve({ ...data, id: Date.now().toString() }) : api.post('/admin/news', data),
    delete: (id: string): Promise<any> => USE_MOCK ? Promise.resolve({ success: true }) : api.delete(`/admin/news/${id}`),
  },
};

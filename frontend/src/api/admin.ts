import { api } from './client';
import { ADMIN_STATS } from './mocks/admin';
import type { AdminFlight, AdminBooking, AdminUser, Kpi, ChartDataPoint, AdminNews } from '../types/admin';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || false; // Follow global config

export const adminApi = {
    kpi: (): Promise<Kpi> => USE_MOCK ? Promise.resolve(ADMIN_STATS.kpi as Kpi) : api.get('/admin/stats'),
  flights: {
    list: (): Promise<AdminFlight[]> => USE_MOCK ? Promise.resolve(ADMIN_STATS.flights as AdminFlight[]) : api.get('/admin/flights'),
    create: (data: Partial<AdminFlight>): Promise<AdminFlight> => USE_MOCK ? Promise.resolve({ ...data, id: Date.now().toString() } as AdminFlight) : api.post('/admin/flights', data),
    update: (id: string, data: Partial<AdminFlight>): Promise<AdminFlight> => USE_MOCK ? Promise.resolve({ ...data, id } as AdminFlight) : api.put(`/admin/flights/${id}`, data),
    delete: (id: string): Promise<{ success: boolean }> => USE_MOCK ? Promise.resolve({ success: true }) : api.delete(`/admin/flights/${id}`),
  },
  bookings: { 
    list: (): Promise<AdminBooking[]> => USE_MOCK ? Promise.resolve(ADMIN_STATS.bookings as AdminBooking[]) : api.get('/admin/bookings') 
  },
  users: { 
    list: (): Promise<AdminUser[]> => USE_MOCK ? Promise.resolve(ADMIN_STATS.users as AdminUser[]) : api.get('/admin/users'),
    updateRole: (id: string, roles: string[]): Promise<{ success: boolean }> => USE_MOCK ? Promise.resolve({ success: true }) : api.put(`/admin/users/${id}/roles`, { roles })
  },
  news: {
    list: (): Promise<AdminNews[]> => USE_MOCK ? Promise.resolve([]) : api.get('/admin/news'),
    create: (data: Partial<AdminNews>): Promise<AdminNews> => USE_MOCK ? Promise.resolve({ ...data, id: Date.now().toString() } as AdminNews) : api.post('/admin/news', data),
    delete: (id: string): Promise<{ success: boolean }> => USE_MOCK ? Promise.resolve({ success: true }) : api.delete(`/admin/news/${id}`),
  },
};

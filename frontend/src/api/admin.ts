import { api } from './client';
import type { AdminFlight, AdminBooking, AdminUser, Kpi, ChartDataPoint, AdminNews } from '../types/admin';

export const adminApi = {
  kpi: (): Promise<any> => api.get('/admin/analytics'),
  flights: {
    list: (): Promise<AdminFlight[]> => api.get('/admin/flights'),
    create: (data: Partial<AdminFlight>): Promise<AdminFlight> => api.post('/admin/flights', data),
    update: (id: string, data: Partial<AdminFlight>): Promise<AdminFlight> => api.put(`/admin/flights/${id}`, data),
    delete: (id: string): Promise<{ success: boolean }> => api.delete(`/admin/flights/${id}`),
  },
  bookings: { 
    list: (): Promise<AdminBooking[]> => api.get('/admin/bookings'),
    updateStatus: (id: string, status: string): Promise<AdminBooking> => api.patch(`/admin/bookings/${id}/status`, { status }),
  },
  users: {
    list: (): Promise<AdminUser[]> => api.get('/admin/users'),
    updateRole: (id: string, roles: string[]): Promise<AdminUser> => api.put(`/admin/users/${id}/role`, { roles }),
    toggleLock: (id: string): Promise<AdminUser> => api.patch(`/admin/users/${id}/lock`),
  },
  news: {
    list: (): Promise<AdminNews[]> => api.get('/admin/news'),
    create: (data: Partial<AdminNews>): Promise<AdminNews> => api.post('/admin/news', data),
    update: (id: string, data: Partial<AdminNews>): Promise<AdminNews> => api.put(`/admin/news/${id}`, data),
    delete: (id: string): Promise<{ success: boolean }> => api.delete(`/admin/news/${id}`),
  },
  payments: {
    list: (): Promise<any[]> => api.get('/admin/payments'),
  },
  logs: {
    list: (): Promise<any[]> => api.get('/admin/logs'),
  },
  promotions: {
    list: (): Promise<any[]> => api.get('/admin/promotions'),
    create: (data: any): Promise<any> => api.post('/admin/promotions', data),
  },
  tours: {
    list: (): Promise<any[]> => api.get('/admin/tours'),
    create: (data: any): Promise<any> => api.post('/tours', data), // Notice route in backend is /api/tours with Admin auth
    update: (id: string, data: any): Promise<any> => api.put(`/tours/${id}`, data),
    delete: (id: string): Promise<any> => api.delete(`/tours/${id}`),
  },
  feedbacks: {
    list: (): Promise<any[]> => api.get('/admin/feedbacks'),
  }
};

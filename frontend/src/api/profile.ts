import { api } from './client';
import type { UpdateProfileDTO, ChangePasswordDTO } from '@/types/user';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || false;

export interface ProfileBooking {
  id: string;
  bookingCode: string;
  route: string;
  date: string;
  amount: number;
  status: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message?: string;
}

export const profileApi = {
  bookings: {
    list: (): Promise<ProfileBooking[]> => USE_MOCK ? Promise.resolve([
      { id: 'B1', bookingCode: 'VNA123', route: 'HAN-SGN', date: '2025-06-15', amount: 3500000, status: 'CONFIRMED' },
      { id: 'B2', bookingCode: 'VNA999', route: 'SGN-DAD', date: '2025-07-20', amount: 1250000, status: 'EXPIRED' }
    ]) : api.get('/profile/bookings'),
  },
  updateProfile: (data: { fullName: string; phone: string }): Promise<import('@/store/authStore').AuthUser> => 
    api.put('/users/profile', data),
  wishlist: {
    list: () => {
      if (USE_MOCK) return Promise.resolve(JSON.parse(localStorage.getItem('vna_wishlist') || '[]'));
      return api.get('/profile/wishlist');
    },
    add: (id: string) => {
      if (USE_MOCK) {
        const w = JSON.parse(localStorage.getItem('vna_wishlist') || '[]');
        if (!w.includes(id)) w.push(id);
        localStorage.setItem('vna_wishlist', JSON.stringify(w));
        return Promise.resolve({ success: true });
      }
      return api.post('/profile/wishlist', { id });
    },
    remove: (id: string) => {
      if (USE_MOCK) {
        const w = JSON.parse(localStorage.getItem('vna_wishlist') || '[]');
        localStorage.setItem('vna_wishlist', JSON.stringify(w.filter((x: string) => x !== id)));
        return Promise.resolve({ success: true });
      }
      return api.delete(`/profile/wishlist/${id}`);
    },
  },
  lotusmiles: {
    me: () => USE_MOCK ? Promise.resolve({
      tier: 'Titanium', miles: 32450, nextTier: 'Platinum', nextTierMiles: 50000,
      history: [
        { id: 1, date: '2025-06-15', action: 'Bay HAN → SGN', miles: 1200, balance: 32450 },
        { id: 2, date: '2025-06-02', action: 'Bay SGN → DAD', miles: 950, balance: 31250 },
        { id: 3, date: '2025-05-20', action: 'Mua sắm đối tác Vietnam Airlines', miles: 500, balance: 30300 },
        { id: 4, date: '2025-05-08', action: 'Bay HAN → CXR', miles: 1100, balance: 29800 },
        { id: 5, date: '2025-04-15', action: 'Đổi vé phần thưởng', miles: -15000, balance: 28700 },
        { id: 6, date: '2025-04-01', action: 'Bay SGN → PQC', miles: 1300, balance: 43700 },
      ],
    }) : api.get('/lotusmiles/me'),
  },
  updateInfo: (data: UpdateProfileDTO): Promise<ProfileUpdateResponse> => USE_MOCK ? Promise.resolve({ success: true }) : api.put('/profile', data),
  changePassword: (data: ChangePasswordDTO): Promise<ProfileUpdateResponse> => USE_MOCK ? Promise.resolve({ success: true }) : api.post('/profile/change-password', data),
};

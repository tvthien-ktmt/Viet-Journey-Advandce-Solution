import { api } from './client';
import type { UpdateProfileDTO, ChangePasswordDTO } from '@/types/user';
import type { AuthUser } from '@/store/authStore';


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
    list: (): Promise<ProfileBooking[]> => api.get('/bookings/my-bookings'),
  },
  updateProfile: (data: { fullName: string; phone: string }): Promise<AuthUser> => 
    api.put('/users/me', data),
  wishlist: {
    list: () => api.get('/wishlist'),
    add: (data: { tourId?: number, hotelId?: number }) => api.post('/wishlist', data),
    remove: (id: string) => api.delete(`/wishlist/${id}`),
  },
  lotusmiles: {
    me: () => api.get('/lotusmiles/me'),
  },
  getLoyaltyHistory: (): Promise<any> => api.get('/loyalty/history'),
  updateInfo: (data: UpdateProfileDTO): Promise<ProfileUpdateResponse> => api.put('/users/me', data),
  changePassword: (data: ChangePasswordDTO): Promise<ProfileUpdateResponse> => api.post('/auth/change-password', data),
};

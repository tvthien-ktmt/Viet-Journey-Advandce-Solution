import { api } from './client';
import type { AuthUser } from '@/store/authStore';

interface LoginResponse { 
  token: string; 
  refreshToken: string;
  user: AuthUser; 
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),
  register: (data: { fullName: string; email: string; password: string; phone: string }) =>
    api.post<LoginResponse>('/auth/register', data),
  me: () => api.get<AuthUser>('/auth/me'),
  forgotPassword: (email: string) => api.post<{message: string}>('/auth/forgot-password', { email }),
  verifyOTP: (email: string, otp: string) => api.post<{message: string}>('/auth/verify-otp', { email, otp }),
  resetPassword: (email: string, otp: string, newPassword: string) => api.post<{message: string}>('/auth/reset-password', { email, otp, newPassword }),
};

import { api } from './client';
import type { AuthUser } from '@/store/authStore';

interface LoginResponse { 
  token: string; 
  user: AuthUser; 
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),
  register: (data: { fullName: string; email: string; password: string; phone: string }) =>
    api.post<LoginResponse>('/auth/register', data),
  me: () => api.get<AuthUser>('/auth/me'),
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role?: 'USER' | 'ADMIN';
  roles?: ('USER' | 'ADMIN')[];
  lotusmilesTier?: 'Ocean' | 'Titanium' | 'Platinum' | 'Gold';
  lotusmilesMiles?: number;
  phone?: string;
}

import { authApi } from '@/api/auth';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  setAuth: (user: AuthUser, token: string, refreshToken?: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: 'USER' | 'ADMIN') => boolean;
  isInitialized: boolean;
  initAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist((set, get) => ({
    user: null,
    token: null,
    refreshToken: null,
    setAuth: (user, token, refreshToken) => {
      set({ user, token, refreshToken: refreshToken || get().refreshToken });
    },
    logout: () => {
      set({ user: null, token: null, refreshToken: null });
    },
    isAuthenticated: () => !!get().user,
    hasRole: (role) => !!get().user?.roles?.includes(role) || get().user?.role === role,
    isInitialized: false,
    initAuth: async () => {
      if (!get().user) {
        set({ isInitialized: true });
        return;
      }
      try {
        const user = await authApi.me();
        set({ user, isInitialized: true });
      } catch {
        set({ user: null, token: null, refreshToken: null, isInitialized: true });
      }
    }
  }), { 
    name: 'vna-auth',
    partialize: (state) => ({ user: state.user }) 
  })
);

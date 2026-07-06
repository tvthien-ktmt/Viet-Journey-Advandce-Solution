import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  roles: ('USER' | 'ADMIN')[];
  lotusmilesTier?: 'Ocean' | 'Titanium' | 'Platinum' | 'Gold';
  lotusmilesMiles?: number;
  phone?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  setAuth: (user: AuthUser, token: string, refreshToken?: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: 'USER' | 'ADMIN') => boolean;
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
    hasRole: (role) => !!get().user?.roles.includes(role),
  }), { 
    name: 'vna-auth',
    partialize: (state) => ({ user: state.user, refreshToken: state.refreshToken, token: state.token }) 
  })
);

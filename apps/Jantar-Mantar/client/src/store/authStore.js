import { create } from 'zustand';
import { ADMIN_TOKEN_KEY } from '../api/axios';

// Admin auth state. Token persists in localStorage (read by the axios
// interceptor); the admin profile is hydrated on demand via /auth/me.
export const useAuthStore = create((set) => ({
  token: localStorage.getItem(ADMIN_TOKEN_KEY) || null,
  admin: null,

  setSession: (token, admin) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    set({ token, admin });
  },
  setAdmin: (admin) => set({ admin }),
  logout: () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    set({ token: null, admin: null });
  },
}));

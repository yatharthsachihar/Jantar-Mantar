import { create } from 'zustand';
import API from '../../api/axios';

export const useAuthStore = create((set) => ({
  admin: null,
  token: localStorage.getItem('agronest_token') || null,
  loading: true,

  init: async () => {
    const token = localStorage.getItem('agronest_token');
    if (!token) {
      set({ loading: false, admin: null });
      return;
    }
    try {
      const res = await API.get('/auth/me');
      set({ admin: res.data, token, loading: false });
    } catch {
      localStorage.removeItem('agronest_token');
      set({ admin: null, token: null, loading: false });
    }
  },

  login: async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('agronest_token', res.data.token);
    set({ admin: res.data.admin, token: res.data.token, loading: false });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('agronest_token');
    set({ admin: null, token: null });
  },
}));

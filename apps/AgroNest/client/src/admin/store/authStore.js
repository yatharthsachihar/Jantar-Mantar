import { create } from 'zustand';
import API from '../../api/axios';

export const useAuthStore = create((set, get) => ({
  admin: null,
  matrix: [],
  token: localStorage.getItem('agronest_token') || null,
  loading: true,

  hasPermission: (moduleKey, requiredLevel = 'view') => {
    const { admin, matrix } = get();
    if (!admin) return false;
    if (admin.role === 'super_admin') return true;
    const mod = matrix?.find(m => m.key === moduleKey);
    if (!mod) return false;
    const level = mod.permissions[admin.role] || 'none';
    if (requiredLevel === 'full') return level === 'full';
    if (requiredLevel === 'view') return level === 'full' || level === 'view';
    return false;
  },

  init: async () => {
    const token = localStorage.getItem('agronest_token');
    if (!token) {
      set({ loading: false, admin: null });
      return;
    }
    try {
      const res = await API.get('/auth/me');
      let matrixRes = { data: [] };
      try {
        matrixRes = await API.get('/roles/matrix');
      } catch (err) {
        console.warn('Failed to load permission matrix', err);
      }
      set({ admin: res.data, matrix: matrixRes.data, token, loading: false });
    } catch {
      localStorage.removeItem('agronest_token');
      set({ admin: null, matrix: [], token: null, loading: false });
    }
  },

  login: async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('agronest_token', res.data.token);
    let matrixRes = { data: [] };
    try {
      matrixRes = await API.get('/roles/matrix');
    } catch (err) {}
    set({ admin: res.data.admin, matrix: matrixRes.data, token: res.data.token, loading: false });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('agronest_token');
    set({ admin: null, matrix: [], token: null });
  },
}));

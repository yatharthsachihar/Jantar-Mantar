import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

// Origin serving uploaded files (API host minus trailing /api).
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

// Resolve a stored image path to a loadable URL. Full URLs / data URIs pass
// through; server-relative /uploads paths are prefixed with the API origin.
export const mediaUrl = (u) => {
  if (!u) return '';
  if (/^(https?:)?\/\//i.test(u) || u.startsWith('data:')) return u;
  return `${API_ORIGIN}${u.startsWith('/') ? '' : '/'}${u}`;
};

export const ADMIN_TOKEN_KEY = 'jantar_mantar_admin_token';

const API = axios.create({ baseURL: API_BASE });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        if (!window.location.pathname.startsWith('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;

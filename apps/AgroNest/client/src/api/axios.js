import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api' });

API.interceptors.request.use((config) => {
  // Admin token for /auth/* routes, user token for everything else
  const adminToken = localStorage.getItem('agronest_token');
  const userToken  = localStorage.getItem('agronest_user_token');

  if (config.url?.startsWith('/auth') && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  } else if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      // If we receive a 403 Forbidden, dispatch event so UserContext can navigate
      // instead of a hard reload which penalizes performance.
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-error-403'));
      }
    }
    return Promise.reject(error);
  }
);

export default API;

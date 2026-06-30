import API from './axios';

// ── Public + admin resource APIs (mirrors the Axiom api/ pattern) ──

export const authApi = {
  login: (data) => API.post('/auth/login', data).then((r) => r.data),
  me: () => API.get('/auth/me').then((r) => r.data),
  listUsers: () => API.get('/auth/users').then((r) => r.data),
  createUser: (data) => API.post('/auth/users', data).then((r) => r.data),
  updateUser: (id, data) => API.put(`/auth/users/${id}`, data).then((r) => r.data),
  deleteUser: (id) => API.delete(`/auth/users/${id}`).then((r) => r.data),
};

export const categoryApi = {
  list: (params) => API.get('/categories', { params }).then((r) => r.data),
  get: (id) => API.get(`/categories/${id}`).then((r) => r.data),
  create: (data) => API.post('/categories', data).then((r) => r.data),
  update: (id, data) => API.put(`/categories/${id}`, data).then((r) => r.data),
  remove: (id) => API.delete(`/categories/${id}`).then((r) => r.data),
};

export const productApi = {
  list: (params) => API.get('/products', { params }).then((r) => r.data),
  get: (slugOrId) => API.get(`/products/${slugOrId}`).then((r) => r.data),
  create: (data) => API.post('/products', data).then((r) => r.data),
  update: (id, data) => API.put(`/products/${id}`, data).then((r) => r.data),
  setFlags: (id, flags) => API.patch(`/products/${id}/flags`, flags).then((r) => r.data),
  remove: (id) => API.delete(`/products/${id}`).then((r) => r.data),
};

export const bannerApi = {
  list: (params) => API.get('/banners', { params }).then((r) => r.data),
  create: (data) => API.post('/banners', data).then((r) => r.data),
  update: (id, data) => API.put(`/banners/${id}`, data).then((r) => r.data),
  remove: (id) => API.delete(`/banners/${id}`).then((r) => r.data),
};

export const orderApi = {
  create: (data) => API.post('/orders', data).then((r) => r.data),
  list: () => API.get('/orders').then((r) => r.data),
  update: (id, data) => API.put(`/orders/${id}`, data).then((r) => r.data),
};

export const settingsApi = {
  get: () => API.get('/settings').then((r) => r.data),
  update: (data) => API.put('/settings', data).then((r) => r.data),
};

export const mediaApi = {
  list: () => API.get('/media').then((r) => r.data),
  upload: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return API.post('/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
  },
  remove: (id) => API.delete(`/media/${id}`).then((r) => r.data),
};

export const roleApi = {
  get: () => API.get('/roles').then((r) => r.data),
  update: (matrix) => API.put('/roles', { matrix }).then((r) => r.data),
};

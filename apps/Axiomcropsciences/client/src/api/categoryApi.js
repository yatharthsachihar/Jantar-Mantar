import API from './axios';
export const categoryApi = {
  getAll: (params) => API.get('/categories', { params }),
  getOne: (id) => API.get(`/categories/${id}`),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  remove: (id, { force, reason } = {}) => API.delete(`/categories/${id}`, { params: { force }, data: { reason } }),
  restore: (id) => API.patch(`/categories/${id}/restore`),
};

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5280/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const clientApi = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
};

export const itemApi = {
  getAll: () => api.get('/items'),
};

export const salesOrderApi = {
  getAll: () => api.get('/salesorders'),
  getById: (id) => api.get(`/salesorders/${id}`),
  create: (data) => api.post('/salesorders', data),
  update: (id, data) => api.put(`/salesorders/${id}`, data),
};

export default api;

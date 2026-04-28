import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  console.error('API Error:', error);
  return Promise.reject(error);
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (data) => api.post('/auth/google', data),
  getMe: () => api.get('/auth/me'),
};

// Product API
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  search: (query) => api.get('/products/search', { params: { q: query } }),
  getByCategory: (category) => api.get(`/products/category/${category}`),
};

// Order API
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (status) => api.get('/orders/my', { params: { status } }),
  getById: (id) => api.get(`/orders/${id}`),
  confirmPayment: (id) => api.post(`/orders/${id}/confirm-payment`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  addProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  bulkRestock: (data) => api.post('/admin/restock', data),
  getUsers: (limit, offset) => api.get('/admin/users', { params: { limit, offset } }),
  banUser: (userId) => api.post(`/admin/users/${userId}/ban`),
  unbanUser: (userId) => api.post(`/admin/users/${userId}/unban`),
  getActivityLogs: (limit, offset) => api.get('/admin/logs', { params: { limit, offset } }),
  getOrders: (status, limit, offset) => api.get('/admin/orders', { params: { status, limit, offset } }),
  approvePendingOrder: (orderId) => api.post(`/admin/orders/${orderId}/approve`),
};

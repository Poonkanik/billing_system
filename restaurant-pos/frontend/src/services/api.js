import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pos_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pos_token');
      localStorage.removeItem('pos_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  seed: () => api.post('/auth/seed'),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  getOne: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const masterAPI = {
  getCompany: () => api.get('/master/company'),
  updateCompany: (data) => api.put('/master/company', data),

  getGroups: () => api.get('/master/groups'),
  createGroup: (data) => api.post('/master/groups', data),
  updateGroup: (id, data) => api.put(`/master/groups/${id}`, data),
  deleteGroup: (id) => api.delete(`/master/groups/${id}`),

  getDepartments: () => api.get('/master/departments'),
  createDepartment: (data) => api.post('/master/departments', data),
  updateDepartment: (id, data) => api.put(`/master/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/master/departments/${id}`),

  getProducts: (params) => api.get('/master/products', { params }),
  createProduct: (data) => api.post('/master/products', data),
  updateProduct: (id, data) => api.put(`/master/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/master/products/${id}`),

  getTables: () => api.get('/master/tables'),
  createTable: (data) => api.post('/master/tables', data),
  updateTable: (id, data) => api.put(`/master/tables/${id}`, data),
  deleteTable: (id) => api.delete(`/master/tables/${id}`),

  getCustomers: () => api.get('/master/customers'),
  createCustomer: (data) => api.post('/master/customers', data),
  updateCustomer: (id, data) => api.put(`/master/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/master/customers/${id}`),
};

export const billsAPI = {
  getAll: (params) => api.get('/bills', { params }),
  getOne: (id) => api.get(`/bills/${id}`),
  create: (data) => api.post('/bills', data),
  update: (id, data) => api.put(`/bills/${id}`, data),
  cancel: (id, reason) => api.delete(`/bills/${id}`, { data: { reason } }),
};

export const reportsAPI = {
  billWise: (params) => api.get('/reports/bill-wise', { params }),
  itemWise: (params) => api.get('/reports/item-wise', { params }),
  salesmanWise: (params) => api.get('/reports/salesman-wise', { params }),
  groupWise: (params) => api.get('/reports/group-wise', { params }),
  timeWise: (params) => api.get('/reports/time-wise', { params }),
  cashierWise: (params) => api.get('/reports/cashier-wise', { params }),
  taxReport: (params) => api.get('/reports/tax-report', { params }),
  dashboard: () => api.get('/reports/dashboard'),
};

export default api;

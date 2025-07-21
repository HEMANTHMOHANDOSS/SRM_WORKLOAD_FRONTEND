import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject({
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  changePassword: (passwords) => api.post('/auth/change-password', passwords),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  approve: (id, comments) => api.post(`/users/${id}/approve`, { comments }),
  reject: (id, reason) => api.post(`/users/${id}/reject`, { reason }),
  getStats: (params) => api.get('/users/stats', { params }),
  getWorkload: (id) => api.get(`/users/${id}/workload`)
};

// Departments API
export const departmentsAPI = {
  getAll: (params) => api.get('/departments', { params }),
  getById: (id) => api.get(`/departments/${id}`),
  create: (departmentData) => api.post('/departments', departmentData),
  update: (id, departmentData) => api.put(`/departments/${id}`, departmentData),
  delete: (id) => api.delete(`/departments/${id}`)
};

// Subjects API
export const subjectsAPI = {
  getAll: (params) => api.get('/subjects', { params }),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (subjectData) => api.post('/subjects', subjectData),
  update: (id, subjectData) => api.put(`/subjects/${id}`, subjectData),
  delete: (id) => api.delete(`/subjects/${id}`)
};

// Timetables API
export const timetablesAPI = {
  getAll: (params) => api.get('/timetables', { params }),
  getById: (id) => api.get(`/timetables/${id}`),
  create: (timetableData) => api.post('/timetables', timetableData),
  generate: (id, constraints) => api.post(`/timetables/${id}/generate`, { constraints }),
  updateSlot: (id, slotId, slotData) => api.put(`/timetables/${id}/slots/${slotId}`, slotData),
  publish: (id) => api.post(`/timetables/${id}/publish`),
  getConflicts: (id) => api.get(`/timetables/${id}/conflicts`),
  getStaffTimetable: (staffId, params) => api.get(`/timetables/staff/${staffId}`, { params })
};

// Choice Forms API
export const choiceFormsAPI = {
  getAll: (params) => api.get('/choice-forms', { params }),
  getActive: () => api.get('/choice-forms/active'),
  getById: (id) => api.get(`/choice-forms/${id}`),
  create: (formData) => api.post('/choice-forms', formData),
  update: (id, formData) => api.put(`/choice-forms/${id}`, formData),
  delete: (id) => api.delete(`/choice-forms/${id}`),
  submit: (id, submissionData) => api.post(`/choice-forms/${id}/submit`, submissionData),
  getSubmissions: (id, params) => api.get(`/choice-forms/${id}/submissions`, { params })
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`)
};

// Rooms API
export const roomsAPI = {
  getAll: (params) => api.get('/rooms', { params }),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (roomData) => api.post('/rooms', roomData),
  update: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  delete: (id) => api.delete(`/rooms/${id}`)
};

export default api;
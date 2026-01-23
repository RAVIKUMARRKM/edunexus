import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear auth state
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
    }
    return Promise.reject(error);
  }
);

// API helper functions
export const apiHelpers = {
  // Students
  getStudents: (params?: Record<string, unknown>) => api.get('/students', { params }),
  getStudent: (id: string) => api.get(`/students/${id}`),
  createStudent: (data: unknown) => api.post('/students', data),
  updateStudent: (id: string, data: unknown) => api.put(`/students/${id}`, data),
  deleteStudent: (id: string) => api.delete(`/students/${id}`),

  // Teachers
  getTeachers: (params?: Record<string, unknown>) => api.get('/teachers', { params }),
  getTeacher: (id: string) => api.get(`/teachers/${id}`),

  // Classes
  getClasses: () => api.get('/classes'),
  getSections: (classId: string) => api.get(`/classes/${classId}/sections`),

  // Attendance
  getAttendance: (params: { classId: string; sectionId: string; date: string }) =>
    api.get('/attendance', { params }),
  markAttendance: (data: unknown) => api.post('/attendance', data),

  // Exams
  getExams: (params?: Record<string, unknown>) => api.get('/exams', { params }),
  getExamResults: (examId: string, studentId?: string) =>
    api.get(`/exams/${examId}/results`, { params: { studentId } }),

  // Fees
  getFeeStatus: (studentId: string) => api.get(`/fees/status/${studentId}`),
  getPaymentHistory: (studentId: string) => api.get(`/fees/history/${studentId}`),
  makePayment: (data: unknown) => api.post('/fees/payment', data),

  // Notices
  getNotices: (params?: Record<string, unknown>) => api.get('/notices', { params }),

  // Dashboard
  getDashboardStats: () => api.get('/dashboard/stats'),

  // Profile
  getProfile: () => api.get('/profile'),
  updateProfile: (data: unknown) => api.put('/profile', data),
};

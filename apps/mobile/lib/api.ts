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

  // Departments
  getDepartments: () => api.get('/departments'),

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

  // Parents
  getParents: (params?: Record<string, unknown>) => api.get('/parents', { params }),
  getParent: (id: string) => api.get(`/parents/${id}`),
  createParent: (data: unknown) => api.post('/parents', data),

  // Messages
  getMessages: (type?: 'received' | 'sent', params?: Record<string, unknown>) =>
    api.get('/messages', { params: { ...params, type } }),
  getMessage: (id: string) => api.get(`/messages/${id}`),
  sendMessage: (data: unknown) => api.post('/messages', data),
  markMessageRead: (id: string) => api.put(`/messages/${id}/read`),
  deleteMessage: (id: string) => api.delete(`/messages/${id}`),

  // Users (for messaging recipient selection)
  getUsers: (params?: Record<string, unknown>) => api.get('/users', { params }),

  // Library
  getBooks: (params?: Record<string, unknown>) => api.get('/library/books', { params }),
  getBook: (id: string) => api.get(`/library/books/${id}`),
  addBook: (data: unknown) => api.post('/library/books', data),
  updateBook: (id: string, data: unknown) => api.put(`/library/books/${id}`, data),
  deleteBook: (id: string) => api.delete(`/library/books/${id}`),
  getBookIssues: (params?: Record<string, unknown>) => api.get('/library/issues', { params }),
  issueBook: (data: unknown) => api.post('/library/issues', data),
  returnBook: (id: string, data?: unknown) => api.post(`/library/issues/${id}/return`, data),

  // Transport
  getVehicles: (params?: Record<string, unknown>) => api.get('/transport/vehicles', { params }),
  getVehicle: (id: string) => api.get(`/transport/vehicles/${id}`),
  addVehicle: (data: unknown) => api.post('/transport/vehicles', data),
  updateVehicle: (id: string, data: unknown) => api.put(`/transport/vehicles/${id}`, data),
  getTransportRoutes: (params?: Record<string, unknown>) => api.get('/transport/routes', { params }),
  getTransportRoute: (id: string) => api.get(`/transport/routes/${id}`),
  addTransportRoute: (data: unknown) => api.post('/transport/routes', data),
  getTransportAllocations: (params?: Record<string, unknown>) => api.get('/transport/allocations', { params }),
  addTransportAllocation: (data: unknown) => api.post('/transport/allocations', data),

  // Hostel
  getHostelBuildings: (params?: Record<string, unknown>) => api.get('/hostel/buildings', { params }),
  getHostelBuilding: (id: string) => api.get(`/hostel/buildings/${id}`),
  addHostelBuilding: (data: unknown) => api.post('/hostel/buildings', data),
  getHostelRooms: (params?: Record<string, unknown>) => api.get('/hostel/rooms', { params }),
  getHostelRoom: (id: string) => api.get(`/hostel/rooms/${id}`),
  addHostelRoom: (data: unknown) => api.post('/hostel/rooms', data),
  getHostelAllocations: (params?: Record<string, unknown>) => api.get('/hostel/allocations', { params }),
  addHostelAllocation: (data: unknown) => api.post('/hostel/allocations', data),

  // Settings
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
};

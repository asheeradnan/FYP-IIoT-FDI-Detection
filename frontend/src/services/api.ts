import axios from 'axios';
import type { 
  LoginCredentials, 
  SignupData, 
  AuthResponse, 
  User, 
  Anomaly, 
  Topology,
  Analytics 
} from '../types';

const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  signup: async (data: SignupData): Promise<User> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Admin
export const adminService = {
  getPendingUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/pending-users');
    return response.data;
  },

  updateUserStatus: async (userId: number, status: 'approved' | 'rejected'): Promise<void> => {
    await api.post('/admin/approve-user', { user_id: userId, approved: status === 'approved' });
  },

  approveUser: async (userId: number, approved: boolean): Promise<void> => {
    await api.post('/admin/approve-user', { user_id: userId, approved });
  },

  getAnalytics: async (): Promise<Analytics> => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },
};

// Model
export const modelService = {
  getAnomalies: async (limit: number = 50, resolved: boolean = false): Promise<Anomaly[]> => {
    const response = await api.get('/model/anomalies', {
      params: { limit, resolved },
    });
    return response.data;
  },

  getTopology: async (): Promise<Topology> => {
    const response = await api.get('/model/topology');
    return response.data;
  },

  resolveAnomaly: async (anomalyId: number): Promise<void> => {
    await api.post(`/model/anomalies/${anomalyId}/resolve`);
  },

  predict: async (sensorData: Record<string, unknown>) => {
    const response = await api.post('/model/predict', { sensor_data: sensorData });
    return response.data;
  },
};

export default api;

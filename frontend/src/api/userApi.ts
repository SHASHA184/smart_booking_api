// src/api/userApi.ts
import axios from 'axios';
import { User, UserCreate, UserUpdate, LoginRequest, AuthResponse } from '../types/user';

const API_BASE_URL = 'http://localhost:8001';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const userApi = {
  // Authentication
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    
    const response = await apiClient.post<AuthResponse>('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // User CRUD operations
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },

  createUser: async (userData: UserCreate): Promise<User> => {
    const response = await apiClient.post<User>('/users/', userData);
    return response.data;
  },

  createAdminUser: async (userData: UserCreate): Promise<User> => {
    const response = await apiClient.post<User>('/users/admin', userData);
    return response.data;
  },

  updateUser: async (userId: number, userData: UserUpdate): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId: number): Promise<User> => {
    const response = await apiClient.delete<User>(`/users/${userId}`);
    return response.data;
  },

  blockUser: async (userId: number): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${userId}/block`);
    return response.data;
  },

  unblockUser: async (userId: number): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${userId}/unblock`);
    return response.data;
  },

  getUserActivityReport: async (userId: number): Promise<string> => {
    const response = await apiClient.get<string>(`/users/${userId}/activity_report`);
    return response.data;
  },
};

export default apiClient;
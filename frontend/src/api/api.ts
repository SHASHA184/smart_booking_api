import axios from 'axios';
import { ApiResponse } from '../types/api';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,  // This will be proxied to the backend during development
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await api.get<T>(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const postData = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response = await api.post<T>(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export default api;
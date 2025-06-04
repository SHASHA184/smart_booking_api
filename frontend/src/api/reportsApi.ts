import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface ReportData {
  total_bookings: number;
  total_revenue: number;
  average_price: number;
  highest_price: number;
  lowest_price: number;
  bookings: Array<{
    booking_id: number;
    property_name: string;
    start_date: string;
    end_date: string;
    price: number;
    status: string;
  }>;
}

export const reportsApi = {
  // Send owner report
  sendOwnerReport: async (): Promise<{ message: string }> => {
    const response = await axios.post(`${API_BASE_URL}/bookings/send-owner-report`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    return response.data as { message: string };
  },

  // Get owner report
  getOwnerReport: async (): Promise<Blob> => {
    const response = await axios.get(`${API_BASE_URL}/reports/owner`, {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    return response.data as Blob;
  },

  // Get user activity report
  getUserActivityReport: async (): Promise<Blob> => {
    const response = await axios.get(`${API_BASE_URL}/reports/user-activity`, {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    return response.data as Blob;
  },

  // Get booking report
  getBookingReport: async (bookingId: number): Promise<Blob> => {
    const response = await axios.get(`${API_BASE_URL}/reports/booking/${bookingId}`, {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    return response.data as Blob;
  },

  // Get analytics data
  getAnalyticsData: async (): Promise<ReportData> => {
    const response = await axios.get(`${API_BASE_URL}/reports/analytics`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    return response.data as ReportData;
  },
}; 
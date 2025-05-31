import apiClient from './apiClient';
import { Booking, BookingCreate, BookingUpdate, PersonalizedOffer } from '../types/booking';

export const bookingApi = {
  getBookings: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get<Booking[]>('/bookings');
    return data;
  },

  getBooking: async (id: number): Promise<Booking> => {
    const { data } = await apiClient.get<Booking>(`/bookings/${id}`);
    return data;
  },

  createBooking: async (booking: BookingCreate): Promise<Booking> => {
    const { data } = await apiClient.post<Booking>('/bookings', booking);
    return data;
  },

  updateBooking: async (id: number, booking: BookingUpdate): Promise<Booking> => {
    const { data } = await apiClient.put<Booking>(`/bookings/${id}`, booking);
    return data;
  },

  deleteBooking: async (id: number): Promise<Booking> => {
    const { data } = await apiClient.delete<Booking>(`/bookings/${id}`);
    return data;
  },

  getPersonalizedOffers: async (): Promise<PersonalizedOffer[]> => {
    const { data } = await apiClient.get<PersonalizedOffer[]>('/bookings/personalized-offers');
    return data;
  },
}; 
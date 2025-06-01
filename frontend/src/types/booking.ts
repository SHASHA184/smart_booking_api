import { Property } from './api';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export interface BookingBase {
  property_id: number;
  start_date: string;
  end_date: string;
  status?: BookingStatus;
}

export interface BookingCreate extends BookingBase {}

export interface BookingUpdate {
  status?: BookingStatus;
  start_date?: string;
  end_date?: string;
}

export interface AccessCode {
  id: number;
  booking_id: number;
  code: string;
  valid_from: string;
  valid_until: string;
}

export interface Booking extends BookingBase {
  id: number;
  user_id: number;
  created_at: string;
  property: Property;
  access_code?: AccessCode;
}

export interface PersonalizedOffer {
  property: Property;
  discount: number;
  message: string;
} 
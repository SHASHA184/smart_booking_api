import { User } from './user';

export interface Property {
  id: number;
  name: string;
  description: string;
  address: string;
  price_per_night: number;
  owner_id: number;
  owner?: User;
  created_at: string;
  updated_at: string;
}

export interface PropertyCreate {
  name: string;
  description: string;
  address: string;
  price_per_night: number;
}

export interface PropertyUpdate {
  name?: string;
  description?: string;
  address?: string;
  price_per_night?: number;
} 
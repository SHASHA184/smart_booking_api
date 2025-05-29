export interface Property {
  id: number;
  name: string;
  description?: string;
  rooms: number;
  price: number;
  location?: string;
  lock_id?: string;
  owner_id: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
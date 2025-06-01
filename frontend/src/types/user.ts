// src/types/user.ts
export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    OWNER = "OWNER"
  }
  
  export interface UserBase {
    first_name: string;
    last_name: string;
    email: string;
    role?: Role;
  }
  
  export interface UserCreate extends UserBase {
    password: string;
  }
  
  export interface UserUpdate {
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: Role;
    password?: string;
  }
  
  export interface User extends UserBase {
    id: number;
    created_at: string;
    is_blocked?: boolean;
  }
  
  export interface UserFull extends User {
    password: string;
  }
  
  // Auth related types
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (userData: UserCreate) => Promise<void>;
    isLoading: boolean;
    isAuthenticated: boolean;
    updateUser: (user: User) => void;
  }
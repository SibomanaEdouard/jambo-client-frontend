import { api } from './api';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  deviceId: string;
}

export interface LoginData {
  email: string;
  password: string;
  deviceId: string;
}

export interface Device {
  id: string;
  deviceId: string;
  isVerified: boolean;
}

export interface AuthResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    balance: number;
    devices: Device[];
    createdAt: string;
  };
  token: string;
  deviceVerified: boolean;
}

export const authService = {
  async register(data: RegisterData): Promise<{ message: string; userId: string }> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};
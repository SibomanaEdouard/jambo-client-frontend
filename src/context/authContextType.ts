import { createContext } from "react";
import type { AuthResponse, Device } from "../services/authService";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  balance: number;
  devices: Device[];
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  deviceVerified: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

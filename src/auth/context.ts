import { createContext } from 'react';
import type {LoginParams, RegisterParams, RegisterResponse} from "@/auth/types.ts";

export interface AuthContextProps {
  isAuthenticated: boolean;
  login: (params: LoginParams, keepLogin: boolean) => Promise<void>;
  logout: () => void;
  register: (params: RegisterParams) => Promise<RegisterResponse>
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);
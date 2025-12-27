import { createContext } from 'react';
import type {LoginParams} from "@/auth/types.ts";

export interface AuthContextProps {
  isAuthenticated: boolean;
  login: (params: LoginParams) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);
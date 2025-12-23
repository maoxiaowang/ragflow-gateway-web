import type {ReactNode} from "react";
import {createContext, useState} from 'react';
import type {LoginParams, LoginResponse} from "@/api/auth";
import {AuthEndpoints} from "@/api/endpoints.ts";
import {request} from "@/api/axios.ts";

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (params: LoginParams) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  // const [loading, setLoading] = useState(false);

  const login = async (params: LoginParams) => {
    // setLoading(true);
    try {
      const data = await request.post<LoginResponse>(AuthEndpoints.login, params);
      localStorage.setItem('token', data.access_token);
      setIsAuthenticated(true);
    } finally {
      // setLoading(false);
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{isAuthenticated, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export {AuthContext};
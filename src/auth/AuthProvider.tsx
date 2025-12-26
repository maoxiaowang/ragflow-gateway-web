import {useEffect, useState} from 'react';
import type { ReactNode } from 'react';
import type {LoginParams} from './auth.types';
import {onLogout} from './auth.events';
import {AuthContext} from './authContext';
import {clearTokens, getToken, setRefreshToken, setToken} from "@/auth/auth.storage";
import {authService} from "@/auth/authService";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());

  useEffect(() => {
    return onLogout(() => setIsAuthenticated(false));
  }, []);

  const login = async (params: LoginParams) => {
    const res = await authService.login(params);
    setToken(res.data.access_token);
    setRefreshToken(res.data.refresh_token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearTokens();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
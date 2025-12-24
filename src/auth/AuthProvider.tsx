import {useEffect, useState} from 'react';
import type {LoginParams, LoginResponse} from './auth.types';
import {AUTH_ENDPOINTS} from '@/api/endpoints';
import {onLogout} from './auth.events';
import {AuthContext} from './authContext';
import {request} from "@/api/request.ts";
import {clearTokens, getToken, setRefreshToken, setToken} from "@/auth/auth.storage.ts";
import type {Response} from "@/api/types.ts";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());

  useEffect(() => {
    return onLogout(() => setIsAuthenticated(false));
  }, []);

  const login = async (params: LoginParams) => {
    const res = await request.post<Response<LoginResponse>>(AUTH_ENDPOINTS.login, params);
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
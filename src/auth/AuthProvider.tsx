import {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import type {LoginParams, RegisterParams} from './types';
import {onLogout} from './events';
import {clearTokens, getToken, setRefreshToken, setToken} from './storage';
import {AuthService} from './service';
import {AuthError} from './errors';
import {AuthContext} from '@/auth/context';

export function AuthProvider({children}: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());

  useEffect(() => {
    return onLogout(() => setIsAuthenticated(false));
  }, []);

  const login = async (params: LoginParams, keepLogin = false) => {
    const res = await AuthService.login(params);
    if (res.code !== 0 || !res.data) {
      // 特殊处理登录失败
      throw new AuthError(res.message);
    }
    setToken(res.data.access_token, !keepLogin);
    setRefreshToken(res.data.refresh_token, !keepLogin);
    setIsAuthenticated(true);
  };

  const register = async (params: RegisterParams) => {
    const res = await AuthService.register(params);
    if (res.code !== 0 || !res.data) throw new AuthError(res.message);
    return res.data;
  };

  const logout = () => {
    clearTokens();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{isAuthenticated, login, register, logout}}>
      {children}
    </AuthContext.Provider>
  );
}
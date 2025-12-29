import {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import type {LoginParams} from './types';
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

  const login = async (params: LoginParams) => {
    const res = await AuthService.login(params);
    if (res.code !== 0 || !res.data) {
      // 特殊处理登录失败
      throw new AuthError(res.message);
    }
    setToken(res.data.access_token);
    setRefreshToken(res.data.refresh_token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearTokens();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{isAuthenticated, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}
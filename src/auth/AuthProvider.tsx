import type {ReactNode} from 'react';
import {useEffect, useState} from 'react';
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
    try {
      const res = await AuthService.login(params);
      setToken(res.access_token, !keepLogin);
      setRefreshToken(res.refresh_token, !keepLogin);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      throw new AuthError(message);
    }
  };

  const register = async (params: RegisterParams) => {
    try {
      return await AuthService.register(params);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      throw new AuthError(message);
    }
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
import {fetchApi} from '@/api/request';
import type {LoginParams, LoginResponse, RegisterParams, RegisterResponse, PasswordRules} from "@/auth/types.ts";
import {API_ENDPOINTS} from "@/api";


export const AuthService = {
  login(params: LoginParams): Promise<LoginResponse> {
    const endpoint = API_ENDPOINTS.auth.login;
    return fetchApi<LoginResponse>({
      url: endpoint.path,
      data: params,
      method: endpoint.method,
    });
  },

  logout(): Promise<void> {
    return fetchApi<void>({
      url: API_ENDPOINTS.auth.logout.path,
      method: 'DELETE',
    });
  },

  register(params: RegisterParams): Promise<RegisterResponse> {
    return fetchApi<RegisterResponse>({
      url: API_ENDPOINTS.auth.register.path,
      data: params,
      method: 'POST',
    });
  },

  getPasswordRules(): Promise<PasswordRules> {
    return fetchApi<PasswordRules>({
      url: API_ENDPOINTS.auth.getPassRules.path,
    });
  },
};
import {fetchApi} from '@/api/request';
import type {LoginParams, LoginResponse, RegisterParams, RegisterResponse} from "@/auth/types.ts";
import {API_ENDPOINTS} from "@/api";
import type {APIResult} from "@/api/types";


export const AuthService = {
  login(params: LoginParams): Promise<APIResult<LoginResponse>> {
    return fetchApi<LoginResponse>({
      url: API_ENDPOINTS.auth.login.path,
      data: params,
      method: 'POST'
    });
  },

  logout() {
    // 暂时没用
    return fetchApi<void>({
      url: API_ENDPOINTS.auth.logout.path,
      method: 'DELETE'
    });
  },

  register(params: RegisterParams): Promise<APIResult<RegisterResponse>> {
    // 暂时没用
    return fetchApi<RegisterResponse>({
      url: API_ENDPOINTS.auth.register.path,
      data: params,
      method: 'POST'
    })
  }
};

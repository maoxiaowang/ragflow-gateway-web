import {request} from '@/api/request';
import type {LoginParams, LoginResponse, RegisterParams, RegisterResponse} from "@/auth/auth.types";
import {AUTH_ENDPOINTS} from "@/api/endpoints.ts";


export const authService = {
  login(params: LoginParams) {
    return request.post<LoginResponse>(
      AUTH_ENDPOINTS.login,
      params,
    );
  },

  logout() {
    return request.post<void>(
      AUTH_ENDPOINTS.logout,
    );
  },

  register(params: RegisterParams) {
    return request.post<RegisterResponse>(
      AUTH_ENDPOINTS.register,
      params
    )
  }
};

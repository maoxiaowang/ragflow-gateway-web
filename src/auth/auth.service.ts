import {request} from '@/api/axios';
import type {LoginParams, LoginResponse, RegisterParams, RegisterResponse} from "@/auth/auth.types";
import {AuthEndpoints} from "@/api/endpoints.ts";


export const authService = {
  login(params: LoginParams) {
    return request.post<LoginResponse>(
      AuthEndpoints.login,
      params,
    );
  },

  logout() {
    return request.post<void>(
      AuthEndpoints.logout,
    );
  },

  register(params: RegisterParams) {
    return request.post<RegisterResponse>(
      AuthEndpoints.register,
      params
    )
  }
};

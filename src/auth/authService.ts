import {request} from '@/api/request';
import type {LoginParams, LoginResponse, RegisterParams, RegisterResponse} from "@/auth/auth.types";
import {API_ENDPOINTS} from "@/api";
import type {APIResponse} from "@/api/types";


export const authService = {
  login(params: LoginParams) {
    return request.post<APIResponse<LoginResponse>>(
      API_ENDPOINTS.auth.login.path,
      params,
    );
  },

  logout() {
    return request.post<void>(
      API_ENDPOINTS.auth.logout.path,
    );
  },

  register(params: RegisterParams) {
    return request.post<RegisterResponse>(
      API_ENDPOINTS.auth.register.path,
      params
    )
  }
};

import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_ORIGIN_URL, API_PREFIX, API_TIMEOUT } from '@/config';
import { emitLogout } from '@/auth/events.ts';
import { clearTokens, getRefreshToken, getToken, setToken } from "@/auth/storage.ts";
import { API_ENDPOINTS } from "@/api";
import type { APIResponse } from "./types";
import { notifications } from '@mantine/notifications';

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE_URL = API_ORIGIN_URL + API_PREFIX;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT || 5000,
});

// ================= request：自动加 token =================
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ================= refresh 逻辑 =================
let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshQueue.forEach(cb => cb(token));
  refreshQueue = [];
};

async function refreshToken(): Promise<string> {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('no refresh token');
  const endpoint = API_ENDPOINTS.auth.refresh
  const res = await axios.post<APIResponse<{ access_token: string }>>(
    API_BASE_URL + endpoint.path,
    { refresh_token: refresh }
  );

  const access_token = res.data.data.access_token;
  setToken(access_token);
  return access_token;
}

// ================= response 拦截器 =================
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfigWithRetry;

    if (error.response?.status === 401 && config && !config._retry) {
      config._retry = true;

      if (isRefreshing) {
        return new Promise(resolve => {
          refreshQueue.push(token => {
            config.headers!.Authorization = `Bearer ${token}`;
            resolve(api(config));
          });
        });
      }

      isRefreshing = true;
      try {
        const newToken = await refreshToken();
        isRefreshing = false;
        onRefreshed(newToken);

        config.headers!.Authorization = `Bearer ${newToken}`;
        return api(config);
      } catch {
        isRefreshing = false;
        clearTokens();
        emitLogout();
        return Promise.reject(error);
      }
    }

    switch (error.response?.status) {
      case 403:
        notifications.show({
          title: "访问受限",
          message: "你没有权限执行此操作",
          color: "red",
          autoClose: 5000,
        });
        break;
      case 404:
        notifications.show({
          title: "未找到",
          message: "请求的资源不存在",
          color: "yellow",
          autoClose: 5000,
        });
        break;
      case 500:
        notifications.show({
          title: "服务器错误",
          message: "请稍后重试",
          color: "red",
          autoClose: 5000,
        });
        break;
      default:
        break;
    }

    return Promise.reject(error);
  }
);


export default api;
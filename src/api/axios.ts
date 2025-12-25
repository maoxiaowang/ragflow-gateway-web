import axios, {AxiosError, type AxiosResponse, type InternalAxiosRequestConfig} from 'axios';
import {API_ORIGIN_URL, API_PREFIX, API_TIMEOUT} from '@/config';
import {emitLogout} from '@/auth/auth.events';
import {clearTokens, getRefreshToken, getToken, setToken} from "@/auth/auth.storage";
import {AUTH_ENDPOINTS} from "@/api/endpoints";
import {useNotification} from "@/hooks/useNotification";

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE_URL = API_ORIGIN_URL + API_PREFIX;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT || 5000,
});

// ========== request：自动加 token ==========
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ========== refresh 逻辑 ==========
let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshQueue.forEach(cb => cb(token));
  refreshQueue = [];
};

async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('no refresh token');

  const res = await axios.post(
    API_BASE_URL + AUTH_ENDPOINTS.refresh,
    {refresh_token: refresh}
  );

  const {access_token} = res.data.data;
  setToken(access_token);
  return access_token;
}

export function getErrorMessage(error: unknown): { code: number; message: string } {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<{ code: number; message: string }>;
    const code = axiosError.response?.data?.code ?? -1;
    const message = axiosError.response?.data?.message || "未知错误";
    return {code, message};
  }
  return {code: -1, message: "未知错误"};
}

// ========== response：401 → refresh ==========
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfigWithRetry;
    const notify = useNotification();

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

    if (error.response?.status === 403) {
      notify.error("访问受限", "你没有权限执行此操作");
    }

    return Promise.reject(error);
  }
);

export default api;
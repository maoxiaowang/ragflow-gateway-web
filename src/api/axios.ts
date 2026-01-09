import axios, {AxiosError, type AxiosResponse, type InternalAxiosRequestConfig,} from 'axios';
import {API_ORIGIN_URL, API_PREFIX, API_TIMEOUT} from '@/config';
import {emitLogout} from '@/auth/events.ts';
import {clearTokens, getRefreshToken, getToken, setToken} from "@/auth/storage.ts";
import {API_ENDPOINTS} from "@/api";
import type {APIResponse} from "./types";

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE_URL = API_ORIGIN_URL + API_PREFIX;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT || 5000,
});

// ================= Request interceptor =================
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ================= Response interceptor =================
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfigWithRetry;

    // ---- 401 + refresh token ----
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

    // other errors: just reject
    return Promise.reject(error);
  }
);

// ================= Refresh logic =================
let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshQueue.forEach(cb => cb(token));
  refreshQueue = [];
};

async function refreshToken(): Promise<string> {
  const refresh = getRefreshToken();
  if (!refresh) {
    throw new Error('no refresh token');
  }

  const endpoint = API_ENDPOINTS.auth.refresh;
  const res = await axios.post<APIResponse<{ access_token: string }>>(
    API_BASE_URL + endpoint.path,
    {refresh_token: refresh},
    {
      headers: {
        'X-Skip-Auth-Refresh': 'true', // do not retry
      },
    }
  );

  const data = unwrapApiResponse(res.data);
  const accessToken = data.access_token

  setToken(accessToken);
  return accessToken;
}

// ================= Error handling =================
export function unwrapApiResponse<T>(
  response: APIResponse<T>,
  allowNullData = false
): T {
  if (response.code !== 0) {
    throw new Error(response.message || '请求失败，响应码异常');
  }
  if (!allowNullData && response.data === null) {
    throw new Error(response.message || '请求失败，数据异常');
  }
  return response.data!;
}


export function handleAxiosError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    // Network error (no response)
    if (error.code === 'ERR_NETWORK') {
      throw new Error('无法连接到服务器');
    }

    // Server responded with non-2xx
    if (error.response) {
      const message =
        error.response.data?.message ||
        `请求失败（${error.response.status}）`;
      throw new Error(message);
    }
  }

  // Unknown error
  if (error instanceof Error) {
    throw error;
  }

  throw new Error('未知错误');
}


export default api;
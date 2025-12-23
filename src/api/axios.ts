import axios, {type AxiosError, type AxiosRequestConfig, type AxiosResponse} from 'axios';
import {showNotification} from '@mantine/notifications';
import {API_BASE_URL, API_TIMEOUT, API_PREFIX} from '@/config';

// 创建 axios 实例
const api = axios.create({
    baseURL: API_BASE_URL + API_PREFIX,
    timeout: API_TIMEOUT || 5000,
});


interface ErrorResponse {
  message?: string;
}

let requestCount = 0;  // 多个请求同时进行时，保证 loading 不会闪烁

export const setupAxiosInterceptors = (setLoading: (val: boolean) => void) => {
  api.interceptors.request.use(config => {
    requestCount++;
    setLoading(true);
    return config;
  });

  api.interceptors.response.use(
    res => {
      requestCount--;
      if (requestCount <= 0) setLoading(false);
      return res;
    },
    err => {
      requestCount--;
      if (requestCount <= 0) setLoading(false);
      return Promise.reject(err);
    }
  );
};

// 请求拦截器：自动加 token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// 响应拦截器：统一处理错误
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ErrorResponse>) => {
    const message = error.response?.data?.message || error.message || '请求失败，请稍后重试';

    showNotification({
      title: '请求失败',
      message,
      color: 'red',
    });

    console.error(error); // 开发调试
    return Promise.reject(error); // 保留异常给调用方处理
  }
);

let globalLoadingCount = 0;
const setLoading = (loading: boolean) => {
  globalLoadingCount += loading ? 1 : -1;
  console.log('Global loading:', globalLoadingCount > 0);
};

// 通用请求封装
export const request = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return handleRequest<T>(() => api.get<T>(url, config));
  },
  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return handleRequest<T>(() => api.post<T>(url, data, config));
  },
  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return handleRequest<T>(() => api.put<T>(url, data, config));
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return handleRequest<T>(() => api.delete<T>(url, config));
  },
};

// 核心处理函数
const handleRequest = async <T>(
  fn: () => Promise<AxiosResponse<T>>
): Promise<T> => {
  try {
    setLoading(true);              // 开始 loading
    const response = await fn();   // 执行请求
    return response.data;          // 返回 data
  } catch (error) {
    // 使用 unknown 避免 any
    const err = error as unknown;
    // 尝试解析 AxiosError
    if ((err as { response?: AxiosResponse<{ message: string }> })?.response) {
      const message = (err as { response: AxiosResponse<{ message: string }> }).response.data.message;
      showNotification({ title: '请求失败', message, color: 'red' });
    } else if (err instanceof Error) {
      showNotification({ title: '请求失败', message: err.message, color: 'red' });
    } else {
      showNotification({ title: '请求失败', message: '未知错误', color: 'red' });
    }
    throw err;
  } finally {
    setLoading(false);
  }
};

export default api;
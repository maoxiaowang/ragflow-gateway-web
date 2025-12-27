import axios, {type AxiosRequestConfig} from "axios";
import type {APIPaginatedResult, APIResponse, APIResult, PaginatedContent} from "./types";
import api from "./axios";


// ================= 通用 API 调用封装 =================
export async function fetchApi<T>(
  config: AxiosRequestConfig
): Promise<APIResult<T | null>> {
  try {
    const res = await api.request<APIResponse<T | null>>(config);
    const response = res.data;

    console.log('fetchApi')
    // 理论上不该发生，但兜底
    if (!response) {
      return {
        code: -1,
        message: '无返回数据',
        data: null,
      };
    }

    return {
      code: response.code,
      message: response.message,
      data: response.data ?? null,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

// ================= 分页 API 调用封装 =================
export async function fetchPaginatedApi<T>(
  config: AxiosRequestConfig
): Promise<APIPaginatedResult<T>> {
  try {
    console.log('fetchPaginatedApi1')
    const res = await api.request<APIResponse<PaginatedContent<T> | null>>(config);
    console.log('fetchPaginatedApi2')
    const response = res.data;

    if (response?.code === 0 && response.data) {
      return {
        code: 0,
        message: response.message,
        data: response.data,
      };
    }

    console.log('fetchPaginatedApi3')

    return {
      code: response?.code ?? -1,
      message: response?.message ?? '请求失败',
      data: emptyPage<T>(),
    };
  } catch (error) {
    return {
      ...handleAxiosError(error),
      data: emptyPage<T>(),
    };
  }
}


function emptyPage<T>(): PaginatedContent<T> {
  return {
    total: 0,
    page: 1,
    page_size: 0,
    items: [],
  };
}

// ================= AxiosError 统一处理 =================
function handleAxiosError<T = null>(error: unknown): APIResult<T> {
  console.log('handleAxiosError')
  console.log(error)
  if (axios.isAxiosError(error)) {
    console.log('isAxiosError')
    if (error.code === 'ERR_NETWORK') {
      return { code: -1, message: '无法连接到服务器', data: null as T };
    }

    if (error.response) {
      return {
        code: error.response.status,
        message: error.response.data?.message ?? '请求失败',
        data: null as T,
      };
    }
  }
  console.log('handleAxiosError end')
  return { code: -1, message: '网络异常', data: null as T };
}
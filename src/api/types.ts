export interface APISuccessResponse<T> {
  code: 0;
  message: string;
  data: T;
}

export interface APIErrorResponse {
  code: number;        // 非 0
  message: string;
  detail?: unknown;
  data: null;
}

export type APIResponse<T> =
  | APISuccessResponse<T>
  | APIErrorResponse;


export interface PaginatedContent<T> {
  // 分页对象
  total: number;
  page: number;
  page_size: number;
  items: T[];  // 分页数据
}

export type APIPaginatedResponse<T> =
  APISuccessResponse<PaginatedContent<T>>
  | APIErrorResponse;


export interface BaseListParams {
  page: number
  page_size: number
  order_by?: string
  desc?: boolean
}

export type ListParams<T extends object = Record<string, never>> =
  BaseListParams & T
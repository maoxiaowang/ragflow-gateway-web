export interface APIResponse<T> {
  // 后端接口返回
  code: number;  // 状态码，0 表示成功
  message: string;  // 提示信息，正常是空字符串，只在出错时有信息
  detail?: unknown;  // 4xx具体错误信息，可不关注
  data: T;  // 普通对象数据 / 分页对象 / 出错为 null
}

export interface PaginatedContent<T> {
  // 分页对象
  total: number;
  page: number;
  page_size: number;
  items: T[];  // 分页数据
}

export interface APIPaginatedResult<T> {
  code: number;
  message: string;
  data: PaginatedContent<T>;
}

export interface APIResult<T> {
  code: number;
  message: string;
  data: T;
}

export interface BaseListParams {
  page: number
  page_size: number
  order_by?: string
  desc?: boolean
}

export type ListParams<T extends object = Record<string, never>> =
  BaseListParams & T
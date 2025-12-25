export interface Response<T> {
  code: number;           // 状态码，0 表示成功
  message: string;        // 提示信息
  detail?: never | null;           // 额外信息，可选
  data: T | null;                // 具体数据
}

export interface PaginatedContent<T> {
  total: number;
  page: number;
  page_size: number;
  items: T[];
}

export interface BaseListParams {
  page: number
  page_size: number
  order_by?: string
  desc?: boolean
}

export type ListParams<T extends object = Record<string, never>> =
  BaseListParams & T
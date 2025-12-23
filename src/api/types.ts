export interface ApiResponse<T> {
  code: number;           // 状态码，0 表示成功
  message: string;        // 提示信息
  detail?: never;           // 额外信息，可选
  data: T;                // 具体数据
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  page_size: number;
  items: T[];
}
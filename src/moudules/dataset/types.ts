export interface Dataset {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  create_date: string;  // 可以考虑 Date，如果后续要处理时间可以用 Date
  update_date: string;
  document_count: number;
  chunk_count: number;
  chunk_method: string;
  language: string;
  embedding_model: string;
  status: string;       // 可能是状态码，如果后续需要可以改成 enum
  token_num: number;
}

export interface DatasetFilters {
  _id?: string
  name?: string
}

export type DocumentStatus =
  | "UNSTART"
  | "RUNNING"
  | "CANCEL"
  | "DONE"
  | "FAIL";


// 文档接口
export interface Document {
  id: string;
  name: string;
  chunk_count: number;
  progress: number;
  size: number; // 单位：字节
  suffix: string;
  type: string;
  run: DocumentStatus; // 使用枚举类型
  create_date: string; // ISO 字符串
  create_time: number;
  process_begin_at: string | null;
  process_duration: number;
  status: string;
}

export interface DocumentFilters {
  keywords?: string
  // suffix?: string
}


export interface UploadDocument {
  id: string;
  name: string;
  size: number;
  suffix?: string; // 可选
}
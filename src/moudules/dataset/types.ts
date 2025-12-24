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
  id?: string
  name?: string
}

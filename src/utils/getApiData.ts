import type {APIResult, PaginatedContent} from "@/api/types";

export function getApiData<T>(res: APIResult<T>): T {
  if (res.code !== 0 || res.data === null) throw new Error(res.message);
  return res.data as T;
}

export function getPaginatedData<T>(res: APIResult<PaginatedContent<T>>): PaginatedContent<T> {
  if (res.code !== 0 || res.data === null) throw new Error(res.message);
  return res.data as PaginatedContent<T>;
}

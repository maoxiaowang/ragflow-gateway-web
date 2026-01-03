import type {AxiosRequestConfig} from "axios";
import type {APIResponse, PaginatedContent} from "./types";
import api, {handleAxiosError, unwrapApiResponse} from "./axios";


// ================= API Call function =================
export async function fetchApi<T>(
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const res = await api.request<APIResponse<T>>(config);
    return unwrapApiResponse(res.data);
  } catch (error) {
    throw handleAxiosError(error);
  }
}

// ================= Paginated API Call function =================
export async function fetchPaginatedApi<T>(
  config: AxiosRequestConfig
): Promise<PaginatedContent<T>> {
  try {
    const res = await api.request<APIResponse<PaginatedContent<T>>>(config);
    return unwrapApiResponse(res.data);
  } catch (error) {
    throw handleAxiosError(error);
  }
}

import { request } from '@/api/request';
import type { User } from './types';
import { API_ENDPOINTS } from '@/api';
import type {APIResponse, PaginatedContent} from "@/api/types";

export const UserService = {
  list: async (
    page = 1,
    page_size = 10,
    order_by?: string,
    desc_order?: boolean
  ): Promise<PaginatedContent<User>> => {
    const res = await request.get<APIResponse<PaginatedContent<User>>>(
      API_ENDPOINTS.user.list.path,
      { params: { page, page_size, order_by, desc_order } }
    );
    return res.data;
  },
};
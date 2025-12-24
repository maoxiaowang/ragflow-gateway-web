import { request } from '@/api/request';
import type { User } from './types';
import { USER_ENDPOINTS } from '@/api/endpoints';
import type {Response, PaginatedContent} from "@/api/types";

export const UserService = {
  list: async (
    page = 1,
    page_size = 10,
    order_by?: string,
    desc_order?: boolean
  ): Promise<PaginatedContent<User>> => {
    const res = await request.get<Response<PaginatedContent<User>>>(
      USER_ENDPOINTS.list,
      { params: { page, page_size, order_by, desc_order } }
    );
    return res.data;
  },
};
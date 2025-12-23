import { request } from '@/api/axios';
import type { User } from './types';
import { UserEndpoints } from '@/api/endpoints';
import type {ApiResponse, PaginatedResponse} from "@/api/types.ts";

export const UserService = {
  list: async (
    page = 1,
    page_size = 10,
    order_by?: string,
    desc_order?: boolean
  ): Promise<PaginatedResponse<User>> => {
    const res = await request.get<ApiResponse<PaginatedResponse<User>>>(
      UserEndpoints.list,
      { params: { page, page_size, order_by, desc_order } }
    );
    console.log(res.data);
    return res.data;
  },
};
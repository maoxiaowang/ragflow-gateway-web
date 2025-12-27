import {fetchPaginatedApi} from '@/api/request';
import type {User} from './types';
import {API_ENDPOINTS} from '@/api';
import type {APIPaginatedResult} from "@/api/types";

export const UserService = {
  list_users: (
    page = 1,
    page_size = 10,
    order_by?: string,
    desc_order?: boolean
  ): Promise<APIPaginatedResult<User>> => {
    return fetchPaginatedApi<User>({
      url: API_ENDPOINTS.user.list.path,
      params: { page, page_size, order_by, desc: desc_order },
      method: 'GET',
    });
  },
};
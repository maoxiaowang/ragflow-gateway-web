import {fetchApi, fetchPaginatedApi} from '@/api/request';
import type {CreateUser, Permission, Role, User} from './types';
import {API_ENDPOINTS} from '@/api';
import type {APIPaginatedResult, APIResult} from "@/api/types";

export const UserService = {
  listUsers: (
    page = 1,
    page_size = 10,
    order_by?: string,
    desc_order?: boolean
  ): Promise<APIPaginatedResult<User>> => {
    const endpoint = API_ENDPOINTS.iam.user.list;
    return fetchPaginatedApi<User>({
      url: endpoint.path,
      params: {page, page_size, order_by, desc: desc_order},
      method: endpoint.method,
    });
  },

  createUser: (payload: CreateUser): Promise<APIResult<User | null>> => {
    const endpoint = API_ENDPOINTS.iam.user.create;
    return fetchApi<User>({
      url: endpoint.path,
      method: endpoint.method,
      data: payload
    });
  },

  // 给用户分配角色
  assignUserRoles: (userId: number, roleIds: number[]): Promise<APIResult<void | null>> => {
    const endpoint = API_ENDPOINTS.iam.user.assign_roles(userId);
    return fetchApi<void>({
      url: endpoint.path,
      method: endpoint.method,
      data: {role_ids: roleIds},
    });
  },

  disableUsers: (userIds: number[], disable: boolean): Promise<APIResult<void | null>> => {
    const endpoint = API_ENDPOINTS.iam.user.disableUsers;
    return fetchApi<void>({
      url: endpoint.path,
      method: endpoint.method,
      data: {user_ids: userIds, disable: disable},
    });
  },

  listUserRoles: (user_id: number): Promise<APIResult<Role[] | null>> => {
    const endpoint = API_ENDPOINTS.iam.user.roles(user_id);
    return fetchApi<Role[]>({
      url: endpoint.path,
      method: endpoint.method,
    });
  }
};

export const RoleService = {
  listRoles: (
    page = 1,
    page_size = 10,
    order_by?: string,
    desc_order?: boolean
  ): Promise<APIPaginatedResult<Role>> => {
    const endpoint = API_ENDPOINTS.iam.role.list;
    return fetchPaginatedApi<Role>({
      url: endpoint.path,
      params: {page, page_size, order_by, desc: desc_order},
      method: endpoint.method,
    });
  },
};

export const PermissionService = {
  listPermissions: (): Promise<APIPaginatedResult<Permission>> => {
    const endpoint = API_ENDPOINTS.iam.permission.list;
    return fetchPaginatedApi<Role>({
      url: endpoint.path,
      method: endpoint.method,
    });
  },
};
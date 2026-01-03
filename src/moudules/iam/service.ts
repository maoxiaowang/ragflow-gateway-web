import {fetchApi, fetchPaginatedApi} from '@/api/request';
import type {CreateUser, DeleteUserResponse, Permission, Role, User} from './types';
import {API_ENDPOINTS} from '@/api';
import type {PaginatedContent} from "@/api/types";

export const UserService = {
  listUsers: (
    page = 1,
    page_size = 10,
    order_by?: string,
    desc_order?: boolean
  ): Promise<PaginatedContent<User>> => {
    const endpoint = API_ENDPOINTS.iam.user.list;
    return fetchPaginatedApi<User>({
      url: endpoint.path,
      params: { page, page_size, order_by, desc: desc_order },
      method: endpoint.method,
    });
  },

  createUser: (payload: CreateUser): Promise<User> => {
    const endpoint = API_ENDPOINTS.iam.user.create;
    return fetchApi<User>({
      url: endpoint.path,
      method: endpoint.method,
      data: payload,
    });
  },

  deleteUser: (id: number): Promise<DeleteUserResponse> => {
    const endpoint = API_ENDPOINTS.iam.user.deleteUser(id);
    return fetchApi<DeleteUserResponse>({
      url: endpoint.path,
      method: endpoint.method,
    });
  },

  deleteUsers: (userIds: number[]): Promise<DeleteUserResponse[]> => {
    const endpoint = API_ENDPOINTS.iam.user.deleteUsers;
    return fetchApi<DeleteUserResponse[]>({
      url: endpoint.path,
      method: endpoint.method,
      data: { user_ids: userIds },
    });
  },

  assignUserRoles: (userId: number, roleIds: number[]): Promise<void> => {
    const endpoint = API_ENDPOINTS.iam.user.assign_roles(userId);
    return fetchApi<void>({
      url: endpoint.path,
      method: endpoint.method,
      data: { role_ids: roleIds },
    });
  },

  disableUsers: (userIds: number[], disable: boolean): Promise<void> => {
    const endpoint = API_ENDPOINTS.iam.user.disableUsers;
    return fetchApi<void>({
      url: endpoint.path,
      method: endpoint.method,
      data: { user_ids: userIds, disable },
    });
  },

  listUserRoles: (user_id: number): Promise<Role[]> => {
    const endpoint = API_ENDPOINTS.iam.user.roles(user_id);
    return fetchApi<Role[]>({
      url: endpoint.path,
      method: endpoint.method,
    });
  },
};

export const RoleService = {
  listRoles: (
    page = 1,
    page_size = 10,
    order_by?: string,
    desc_order?: boolean
  ): Promise<PaginatedContent<Role>> => {
    const endpoint = API_ENDPOINTS.iam.role.list;
    return fetchPaginatedApi<Role>({
      url: endpoint.path,
      params: { page, page_size, order_by, desc: desc_order },
      method: endpoint.method,
    });
  },
};

export const PermissionService = {
  listPermissions: (): Promise<PaginatedContent<Permission>> => {
    const endpoint = API_ENDPOINTS.iam.permission.list;
    return fetchPaginatedApi<Permission>({
      url: endpoint.path,
      method: endpoint.method,
    });
  },
};
import { useQuery } from '@tanstack/react-query';
import { UserService } from './service';
import type {User} from "@/moudules/user/types";  // list users service

export const useUsers = ({
  page = 1,
  pageSize = 10,
  orderBy,
  descOrder,
}: {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  descOrder?: boolean;
}) =>
  useQuery<User[], Error>({
    queryKey: ['users', page, pageSize, orderBy, descOrder],
    queryFn: () => UserService.list(page, pageSize, orderBy, descOrder),
    keepPreviousData: true,
  });
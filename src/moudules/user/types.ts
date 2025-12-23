
export interface User {
  id: number;
  username: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserListResponse {
  data: {
    total: number;
    page: number;
    page_size: number;
    items: User[];
  };
  code: number;
  message: string;
}

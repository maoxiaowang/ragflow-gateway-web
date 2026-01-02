
export interface User {
  id: number;
  username: string;
  nickname: string;
  avatar: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}


export interface Role {
  id: number;
  name: string;
  display_name: string;
  created_at?: string;
  updated_at?: string;
}


export interface Permission {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}


export interface CreateUser {
  username: string;
  password: string;
  nickname?: string;
  is_active?: boolean;
}
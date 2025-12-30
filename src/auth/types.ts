export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}


export interface RegisterParams {
  username: string;
  password1: string;
  password2: string;
  invite_code: string
}

export interface RegisterResponse {
  id: bigint;
  username: string;
  nickname: string;
  is_active: boolean;
  avatar: string
}


export interface PasswordRules {
  min_length: number;
  uppercase: boolean;
  lowercase: boolean;
  digits: boolean;
  symbols: boolean;
}

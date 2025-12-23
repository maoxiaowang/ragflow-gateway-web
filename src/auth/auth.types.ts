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
}

export interface RegisterResponse {
  id: bigint;
  username: string;
}
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USERNAME_KEY = 'username'
const UID_KEY = 'uid'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function removeRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function clearTokens() {
  removeToken();
  removeRefreshToken();
}

export function setUserInfo(uid: number, username: string) {
  localStorage.setItem(UID_KEY, String(uid));
  localStorage.setItem(USERNAME_KEY, username)
}

export function getUserInfo(): object {
  const userid: string | null = localStorage.getItem(UID_KEY)
  const username: string | null = localStorage.getItem(USERNAME_KEY)
  return {userid: userid, username: username}
}
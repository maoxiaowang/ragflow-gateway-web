/*
前端路由
 */
export const ROUTES = {
  auth: {
    login: {path: '/auth/login', label: '登录获取token'},
    logout: {path: '/auth/logout', label: '退出登录'},
    refresh: {path: '/auth/refresh', label: '刷新token'}
  },

  dashboard: {path: '/dashboard', label: '首页'},

  datasets: {
    list: {path: '/datasets', label: '知识库列表'},
    detail: (id: string) => ({path: `/datasets/${id}`, label: '知识库详情'}),
  },

  users: {
    list: {path: '/users', label: '用户列表'},
    detail: (id: string) => ({path: `/users/${id}`, label: '用户详情'}),
  },
} as const;
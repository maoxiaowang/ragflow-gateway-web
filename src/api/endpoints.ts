export const DASHBOARD_ENDPOINTS = {
  overview: '/dashboard/overview',
  stats: '/dashboard/stats',
};


export const AUTH_ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
};


export const USER_ENDPOINTS = {
  list: '/users',
}

export const RAGFLOW_ENDPOINTS = {
  dataset: {
    list: '/ragflow/datasets',
    // create: '/datasets',     // 如果需要创建接口
    // get: (id: string) => `/datasets/${id}`, // 动态 id
    // update: (id: string) => `/datasets/${id}`,
    // delete: (id: string) => `/datasets/${id}`,
  },
}
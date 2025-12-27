/*
后端 API
 */
export const API_ENDPOINTS = {
  auth: {
    login: { path: '/auth/login', label: '登录' },
    register: { path: '/auth/register', label: '注册' },
    logout: { path: '/auth/logout', label: '退出登录' },
    refresh: { path: '/auth/refresh', label: '刷新 token' },
  },
  user: {
    list: { path: '/users', label: '用户列表' },
  },
  ragflow: {
    dataset: {
      list: { path: '/ragflow/datasets', label: '知识库列表' },
    },
    document: {
      list: (id: string) => ({path: `/ragflow/datasets/${id}/documents`, label: '文档列表'}),
      upload: (datasetId: string) => ({
        path: `/ragflow/datasets/${datasetId}/documents`, label: '上传文档'
      }),
    }
  },
} as const;
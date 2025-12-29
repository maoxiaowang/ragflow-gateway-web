/*
后端 API
 */
export const API_ENDPOINTS = {
  auth: {
    login: { path: '/auth/login', label: '登录', method: 'POST'},
    register: { path: '/auth/register', label: '注册', method: 'POST' },
    logout: { path: '/auth/logout', label: '退出登录' , method: 'DELETE'},
    refresh: { path: '/auth/refresh', label: '刷新 token' , method: 'POST'},
  },
  user: {
    list: { path: '/users', label: '用户列表' , method: 'GET'},
  },
  ragflow: {
    dataset: {
      list: { path: '/ragflow/datasets', label: '知识库列表', method: 'GET'},
    },
    document: {
      list: (id: string) => ({path: `/ragflow/datasets/${id}/documents`, label: '文档列表', method: 'GET'}),
      upload: (datasetId: string) => ({
        path: `/ragflow/datasets/${datasetId}/documents`, label: '上传文档（支持多个）', method: 'POST'
      }),
      delete: (datasetId: string) => ({
        path: `/ragflow/datasets/${datasetId}/documents`, label: '删除文档（支持多个）', method: 'DELETE'
      }),
      download: (datasetId: string, documentId: string) => ({
        path: `/ragflow/datasets/${datasetId}/documents/${documentId}`, label: '下载文档', method: 'GET'
      }),
      parse: (datasetId: string) => ({
        path: `/ragflow/datasets/${datasetId}/chunks`, label: '解析文档（支持多个）', method: 'POST'
      }),
      deleteChunks: (datasetId: string, documentId: string) => ({
        path: `/ragflow/datasets/${datasetId}/documents/${documentId}/chunks`, label: '删除文档切片', method: 'DELETE'
      })
    }
  },
} as const;
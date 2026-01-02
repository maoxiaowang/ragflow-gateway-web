/*
后端 API
 */
export const API_ENDPOINTS = {
  auth: {
    login: {path: '/auth/login', method: 'POST', label: '登录'},
    register: {path: '/auth/register', method: 'POST', label: '注册'},
    logout: {path: '/auth/logout', method: 'DELETE', label: '退出登录'},
    refresh: {path: '/auth/refresh', method: 'POST', label: '刷新token'},
    getPassRules: {path: '/auth/password-rules', method: 'GET', label: '获取密码规则'},
  },
  iam: {
    user: {
      list: {path: '/iam/users', method: 'GET', label: '用户列表'},
      create: {path: '/iam/users', method: 'POST', label: '用户创建'},
      roles: (userId: number) =>({
         path: `/iam/users/${userId}/roles`, method: 'GET', label: '用户角色列表'
      }),
      assign_roles: (userId: number) =>({
         path: `/iam/users/${userId}/roles`, method: 'POST', label: '给用户分配角色'
      }),
      disableUsers: {
        path: `/iam/users/disable`, method: 'POST', label: '禁用用户（支持多个）'
      }
    },
    role: {
      list: {path: '/iam/roles', method: 'GET', label: '角色列表'},
      permissions: {path: '/iam/roles/{role_id}/permissions', method: 'GET', label: '角色权限列表'},
      assign_permissions: {path: '/iam/roles/{role_id}/permissions', method: 'POST', label: '给角色分配权限'},
    },
    permission: {
      list: {path: '/iam/permissions', method: 'GET', label: '权限列表'},
    }
  },
  ragflow: {
    dataset: {
      list: {path: '/ragflow/datasets', method: 'GET', label: '知识库列表'},
    },
    document: {
      list: (id: string) => ({
        path: `/ragflow/datasets/${id}/documents`, method: 'GET', label: '文档列表'
      }),
      upload: (datasetId: string) => ({
        path: `/ragflow/datasets/${datasetId}/documents`, method: 'POST', label: '上传文档（支持多个）'
      }),
      delete: (datasetId: string) => ({
        path: `/ragflow/datasets/${datasetId}/documents`, method: 'DELETE', label: '删除文档（支持多个）'
      }),
      download: (datasetId: string, documentId: string) => ({
        path: `/ragflow/datasets/${datasetId}/documents/${documentId}`, method: 'GET', label: '下载文档'
      }),
      parse: (datasetId: string) => ({
        path: `/ragflow/datasets/${datasetId}/chunks`, method: 'POST', label: '解析文档（支持多个）'
      }),
      deleteChunks: (datasetId: string, documentId: string) => ({
        path: `/ragflow/datasets/${datasetId}/documents/${documentId}/chunks`, method: 'DELETE', label: '删除文档切片'
      })
    }
  },
} as const;
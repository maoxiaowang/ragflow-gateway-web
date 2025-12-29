import type {APIPaginatedResult, APIResult, ListParams} from "@/api/types";

import {API_ENDPOINTS, fetchApi, fetchPaginatedApi} from "@/api";
import type {Dataset, Document, DatasetFilters, DocumentFilters, UploadDocument} from "@/moudules/dataset/types";

export const DatasetService = {
  list_datasets: async (
    params: Partial<ListParams<DatasetFilters>> = {}
  ): Promise<APIPaginatedResult<Dataset>> => {
    const defaultParams: ListParams<DatasetFilters> = {
      page: 1,
      page_size: 30,
      order_by: 'create_time',
      desc: true,
    };
    const finalParams: ListParams<DatasetFilters> = {...defaultParams, ...params};
    const endpoint = API_ENDPOINTS.ragflow.dataset.list
    return fetchPaginatedApi<Dataset>({
      url: endpoint.path,
      method: endpoint.method,
      params: finalParams
    });
  },

  list_documents: async (
    datasetId: string,
    params: Partial<ListParams<DocumentFilters>> = {}
  ): Promise<APIPaginatedResult<Document>> => {
    const defaultParams: ListParams<DocumentFilters> = {
      page: 1,
      page_size: 30,
      order_by: 'create_time',
      desc: true,
    };
    const finalParams: ListParams<DocumentFilters> = {...defaultParams, ...params};
    const endpoint = API_ENDPOINTS.ragflow.document.list(datasetId)
    return fetchPaginatedApi<Document>({
      url: endpoint.path,
      method: endpoint.method,
      params: finalParams
    });
  },

  uploadDocument: async (
    datasetId: string,
    file: File
  ): Promise<APIResult<UploadDocument[] | null>> => {
    const formData = new FormData();
    formData.append("files", file);

    // 直接返回 fetchApi 的结果
    const endpoint = API_ENDPOINTS.ragflow.document.upload(datasetId)
    return fetchApi<UploadDocument[]>({
      url: endpoint.path,
      method: endpoint.method,
      data: formData,
    });
  },

  deleteDocuments: async (
    datasetId: string,
    documentIds: string[]
  ): Promise<APIResult<null>> => {
    const endpoint = API_ENDPOINTS.ragflow.document.delete(datasetId)
    return fetchApi<null>({
      url: endpoint.path,
      method: endpoint.method,
      data: {
        document_ids: documentIds,
      },
    });
  },

  parseDocuments: async (
    datasetId: string,
    documentIds: string[]
  ): Promise<APIResult<null>> => {
    const endpoint = API_ENDPOINTS.ragflow.document.parse(datasetId)
    return fetchApi<null>({
      url: endpoint.path,
      method: endpoint.method,
      data: {
        document_ids: documentIds
      }
    })
  },

  deleteChunks: async (
    datasetId: string,
    documentId: string
  ): Promise<APIResult<null>> => {
    const endpoint = API_ENDPOINTS.ragflow.document.deleteChunks(datasetId, documentId)
    return fetchApi<null>({
      url: endpoint.path,
      method: endpoint.method
    })
  }
};

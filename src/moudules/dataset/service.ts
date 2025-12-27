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

    const finalParams: ListParams<DatasetFilters> = { ...defaultParams, ...params };

    return fetchPaginatedApi<Dataset>({
      url: API_ENDPOINTS.ragflow.dataset.list.path,
      method: "GET",
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

    const finalParams: ListParams<DocumentFilters> = { ...defaultParams, ...params };

    return fetchPaginatedApi<Document>({
      url: API_ENDPOINTS.ragflow.document.list(datasetId).path,
      method: "GET",
      params: finalParams
    });
  },

 uploadDocument: async (
    datasetId: string,
    file: File
  ): Promise<APIResult<UploadDocument | null>> => {
    const formData = new FormData();
    formData.append("files", file);

    // 直接返回 fetchApi 的结果
    return fetchApi<UploadDocument>({
      url: API_ENDPOINTS.ragflow.document.upload(datasetId).path,
      method: "POST",
      data: formData,
    });
  },
};

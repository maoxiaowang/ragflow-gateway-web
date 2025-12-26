import {request} from "@/api/request";
import {API_ENDPOINTS} from "@/api";
import type {Dataset, DatasetFilters} from "@/moudules/dataset/types";
import type {ListParams, PaginatedContent, APIResponse} from "@/api/types";


export const DatasetServices = {
  list: async (
    params: Partial<ListParams<DatasetFilters>> = {}
  ): Promise<PaginatedContent<Dataset>> => {

    const defaultParams: ListParams<DatasetFilters> = {
      page: 1,
      page_size: 20,
      order_by: 'create_time',
      desc: true,
    }

    const finalParams: ListParams<DatasetFilters> = {
      ...defaultParams,
      ...params,
    }

    const resp = await request.get<APIResponse<PaginatedContent<Dataset>>>(
      API_ENDPOINTS.ragflow.dataset.list.path,
      { params: finalParams }
    );

    return resp.data;
  }
}
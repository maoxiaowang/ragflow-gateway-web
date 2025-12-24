import {request} from "@/api/request";
import {RAGFLOW_ENDPOINTS} from "@/api/endpoints";
import type {Dataset, DatasetFilters} from "@/moudules/dataset/types";
import type {ListParams, PaginatedContent, Response} from "@/api/types.ts";


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

    const resp = await request.get<Response<PaginatedContent<Dataset>>>(
      RAGFLOW_ENDPOINTS.dataset.list,
      { params: finalParams }
    );

    return resp.data;
  }
}
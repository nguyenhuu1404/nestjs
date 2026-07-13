import { apiClient } from "./client";
import { PaginatedResponse } from "@/types/pagination";

export function createResourceApi<
  TEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TEntity>,
>(basePath: string) {
  return {
    findAll: (token: string) => apiClient.get<TEntity[]>(basePath, { token }),
    findAllPaginated: (
      query: {
        page?: number;
        limit?: number;
        [key: string]: string | number | undefined;
      },
      token: string,
    ) => {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== "") params.set(key, String(value));
      });
      const qs = params.toString();
      return apiClient.get<PaginatedResponse<TEntity>>(
        `${basePath}${qs ? `?${qs}` : ""}`,
        { token },
      );
    },
    findOne: (id: number, token: string) =>
      apiClient.get<TEntity>(`${basePath}/${id}`, { token }),
    create: (data: TCreateDto, token: string) =>
      apiClient.post<TEntity>(basePath, data, { token }),
    update: (id: number, data: TUpdateDto, token: string) =>
      apiClient.patch<TEntity>(`${basePath}/${id}`, data, { token }),
    remove: (id: number, token: string) =>
      apiClient.delete<void>(`${basePath}/${id}`, { token }),
  };
}

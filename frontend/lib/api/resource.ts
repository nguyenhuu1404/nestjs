import { apiClient } from "./client";

export function createResourceApi<
  TEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TEntity>,
>(basePath: string) {
  return {
    findAll: (token: string) => apiClient.get<TEntity[]>(basePath, { token }),
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

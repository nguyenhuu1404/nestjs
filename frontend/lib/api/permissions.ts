import { createResourceApi } from "./resource";
import { Permission } from "@/types/permission";

export interface CreatePermissionDto {
  name: string;
  module: string;
  description?: string;
}
export type UpdatePermissionDto = Partial<CreatePermissionDto>;

export const permissionsApi = createResourceApi<
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto
>("/permissions");

import { createResourceApi } from "./resource";
import { Role } from "@/types/role";

export interface CreateRoleDto {
  name: string;
  description?: string;
  isActive?: boolean;
  permissionIds?: number[];
}
export type UpdateRoleDto = Partial<CreateRoleDto>;

export const rolesApi = createResourceApi<Role, CreateRoleDto, UpdateRoleDto>(
  "/roles",
);

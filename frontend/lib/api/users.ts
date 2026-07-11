import { createResourceApi } from "./resource";
import { User } from "@/types/user";

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  isActive?: boolean;
  roleIds?: number[];
}
export type UpdateUserDto = Partial<Omit<CreateUserDto, "password">>;

export const usersApi = createResourceApi<User, CreateUserDto, UpdateUserDto>(
  "/users",
);

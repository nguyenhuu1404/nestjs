"use server";

import { revalidatePath } from "next/cache";
import { requireToken } from "@/lib/session";
import {
  permissionsApi,
  CreatePermissionDto,
  UpdatePermissionDto,
} from "@/lib/api/permissions";
import { ApiError } from "@/lib/api/client";

export async function createPermission(dto: CreatePermissionDto) {
  const token = await requireToken();
  try {
    await permissionsApi.create(dto, token);
    revalidatePath("/admin/permissions"); // báo Next.js làm mới data cache trang list
    return { success: true as const };
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Đã có lỗi xảy ra";
    return { success: false as const, message };
  }
}

export async function updatePermission(id: number, dto: UpdatePermissionDto) {
  const token = await requireToken();
  try {
    await permissionsApi.update(id, dto, token);
    revalidatePath("/admin/permissions");
    return { success: true as const };
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Đã có lỗi xảy ra";
    return { success: false as const, message };
  }
}

export async function deletePermission(id: number) {
  const token = await requireToken();
  try {
    await permissionsApi.remove(id, token);
    revalidatePath("/admin/permissions");
    return { success: true as const };
  } catch (err) {
    console.log("Err>>", err);
    const message = err instanceof ApiError ? err.message : "Đã có lỗi xảy ra";
    return { success: false as const, message };
  }
}

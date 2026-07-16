"use server";

import { revalidatePath } from "next/cache";
import { requireToken } from "@/lib/session";
import { mediaApi } from "@/lib/api/media";

export async function updateMediaAction(
  id: number,
  dto: { altText?: string; fileName?: string },
) {
  const token = await requireToken();
  await mediaApi.update(id, dto, token);
  revalidatePath("/admin/media");
}

export async function deleteMediaAction(id: number) {
  const token = await requireToken();
  await mediaApi.remove(id, token);
  revalidatePath("/admin/media");
}

import { createResourceApi } from "./resource";
import { Media } from "@/types/media";

export interface UpdateMediaDto {
  fileName?: string;
  altText?: string;
}

export const mediaApi = {
  ...createResourceApi<Media, never, UpdateMediaDto>("/media"),

  upload: async (file: File, folder: string): Promise<Media> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/media/upload?folder=${folder}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
};

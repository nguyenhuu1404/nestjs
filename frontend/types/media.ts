export interface Media {
  id: number;
  fileName: string;
  altText: string | null;
  url: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  folder: string;
  uploadedById: number;
  createdAt: string;
}

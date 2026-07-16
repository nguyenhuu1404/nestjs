export interface UploadResult {
  key: string;
  url: string;
}

export interface StorageDriver {
  upload(file: Express.Multer.File, folder: string): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  getPublicUrl(key: string): string;
}

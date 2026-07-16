import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { mkdir, writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { StorageDriver, UploadResult } from '../storage-driver.interface';

@Injectable()
export class LocalStorageDriver implements StorageDriver {
  private uploadDir: string;
  private publicBaseUrl: string;

  constructor(private config: ConfigService) {
    this.uploadDir = this.config.get<string>('LOCAL_UPLOAD_DIR') ?? './uploads';
    this.publicBaseUrl = this.config.get<string>('LOCAL_PUBLIC_URL') ?? 'http://localhost:3001/uploads';
  }

  async upload(file: Express.Multer.File, folder: string): Promise<UploadResult> {
    const ext = file.originalname.split('.').pop();
    const key = `${folder}/${randomUUID()}.${ext}`;
    const fullPath = join(this.uploadDir, key);

    await mkdir(join(this.uploadDir, folder), { recursive: true });
    await writeFile(fullPath, file.buffer);

    return { key, url: this.getPublicUrl(key) };
  }

  async delete(key: string): Promise<void> {
    await unlink(join(this.uploadDir, key)).catch(() => {});
  }

  getPublicUrl(key: string): string {
    return `${this.publicBaseUrl}/${key}`;
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { StorageDriver, UploadResult } from '../storage-driver.interface';

@Injectable()
export class S3StorageDriver implements StorageDriver {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor(private config: ConfigService) {
    this.bucket = this.config.get<string>('S3_BUCKET')!;
    this.publicUrl = this.config.get<string>('S3_PUBLIC_URL')!;

    const endpoint = this.config.get<string>('S3_ENDPOINT');
    const accessKey = this.config.get<string>('S3_ACCESS_KEY');
    const secretKey = this.config.get<string>('S3_SECRET_KEY');

    this.client = new S3Client({
      region: this.config.get<string>('S3_REGION') ?? 'us-east-1',
      ...(endpoint ? { endpoint } : {}), // chỉ set với MinIO, bỏ trống khi dùng AWS S3 thật

      // Chỉ truyền credentials tường minh khi CÓ khai báo trong .env (dùng cho MinIO local).
      // Nếu không có -> KHÔNG set field này, AWS SDK tự dùng Default Credential Provider Chain,
      // tự động lấy credentials tạm thời từ EC2 Instance Metadata (IAM Role) khi chạy trên EC2 thật.
      ...(accessKey && secretKey
        ? { credentials: { accessKeyId: accessKey, secretAccessKey: secretKey } }
        : {}),

      forcePathStyle: this.config.get<string>('S3_FORCE_PATH_STYLE') === 'true',
    });
  }

  async upload(file: Express.Multer.File, folder: string): Promise<UploadResult> {
    const ext = file.originalname.split('.').pop();
    const key = `${folder}/${randomUUID()}.${ext}`;

    await this.client.send(
      new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: file.buffer, ContentType: file.mimetype }),
    );

    return { key, url: this.getPublicUrl(key) };
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }
}

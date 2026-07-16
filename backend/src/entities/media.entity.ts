export class MediaEntity {
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
    createdAt: Date;
  
    constructor(partial: Partial<MediaEntity>) {
      Object.assign(this, partial);
    }
}

import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import sharp from 'sharp';
import { STORAGE_DRIVER } from '@core/storage/storage.constants';
import type { StorageDriver } from '@core/storage/storage-driver.interface';
import { MediaRepository } from '@core/repositories/media.repository';
import { MediaMapper } from './mappers/media.mapper';
import { QueryMediaDto } from './v1/dto/query-media.dto';
import { UpdateMediaDto } from './v1/dto/update-media.dto';
import { MediaEntity } from '@entities/media.entity';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@core/constants/pagination.constant';

@Injectable()
export class MediaService {
  constructor(
    @Inject(STORAGE_DRIVER) private storage: StorageDriver,
    private mediaRepository: MediaRepository,
    private mediaMapper: MediaMapper,
  ) {}

  async upload(file: Express.Multer.File, folder: string, uploadedById: number): Promise<MediaEntity> {
    const { key, url } = await this.storage.upload(file, folder);

    let width: number | undefined;
    let height: number | undefined;
    if (file.mimetype.startsWith('image/')) {
      const metadata = await sharp(file.buffer).metadata();
      width = metadata.width;
      height = metadata.height;
    }

    const media = await this.mediaRepository.create({
      fileName: file.originalname,
      key,
      url,
      mimeType: file.mimetype,
      size: file.size,
      width,
      height,
      folder,
      uploadedById,
    });

    return this.mediaMapper.toEntity(media);
  }

  async findAll(query: QueryMediaDto) {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_PAGE_SIZE;

    const { items, total } = await this.mediaRepository.findAllPaginated({
      page,
      limit,
      fileName: query.fileName,
      folder: query.folder,
    });

    return {
      items: this.mediaMapper.toEntities(items),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number): Promise<MediaEntity> {
    const media = await this.mediaRepository.findById(id);
    if (!media) throw new NotFoundException('Không tìm thấy file');
    return this.mediaMapper.toEntity(media);
  }

  async update(id: number, dto: UpdateMediaDto): Promise<MediaEntity> {
    const media = await this.mediaRepository.findById(id);
    if (!media) throw new NotFoundException('Không tìm thấy file');

    const updated = await this.mediaRepository.update(id, dto);
    return this.mediaMapper.toEntity(updated);
  }

  async remove(id: number, requestUserId: number, isAdmin: boolean): Promise<void> {
    const media = await this.mediaRepository.findById(id);
    if (!media) throw new NotFoundException('Không tìm thấy file');

    if (media.uploadedById !== requestUserId && !isAdmin) {
      throw new ForbiddenException('Bạn không có quyền xoá file này');
    }

    await this.storage.delete(media.key);
    await this.mediaRepository.delete(id);
  }
}

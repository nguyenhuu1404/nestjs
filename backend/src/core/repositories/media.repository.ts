import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma.service';
import { BaseRepository } from '@core/repositories/base.repository';
import { Media } from '@prisma/client';

@Injectable()
export class MediaRepository extends BaseRepository<Media, any, any> {
  protected model;
  constructor(private prisma: PrismaService) {
    super();
    this.model = this.prisma.media;
  }

  findByName(name: string) {
    return this.prisma.permission.findUnique({ where: { name } });
  }

  findByModule(module: string) {
    return this.model.findMany({ where: { module } });
  }

  findByIds(ids: number[]) {
    return this.model.findMany({ where: { id: { in: ids } } });
  }

  findAllPaginated(params: { page: number; limit: number; fileName?: string; folder?: string }) {
    const { page, limit, fileName, folder } = params;
    const where: any = {};
    if (fileName) where.fileName = { contains: fileName, mode: 'insensitive' };
    if (folder) where.folder = folder;

    return Promise.all([
      this.prisma.media.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.media.count({ where }),
    ]).then(([items, total]) => ({ items, total }));
  }
}

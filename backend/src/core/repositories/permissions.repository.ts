import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma.service';
import { BaseRepository } from '@core/repositories/base.repository';
import { Permission } from '@prisma/client';

@Injectable()
export class PermissionsRepository extends BaseRepository<Permission, any, any> {
  protected model;
  constructor(private prisma: PrismaService) {
    super();
    this.model = this.prisma.permission;
  }

  findByName(name: string) {
    return this.prisma.permission.findUnique({ where: { name } });
  }

  findByModule(module: string) {
    return this.prisma.permission.findMany({ where: { module } });
  }

  findByIds(ids: number[]) {
    return this.prisma.permission.findMany({ where: { id: { in: ids } } });
  }

  async findAllPaginated(params: { page: number; limit: number; name?: string; module?: string }) {
    const { page, limit, name, module } = params;

    const where: any = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (module) where.module = { contains: module, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.permission.count({ where }),
    ]);

    return { items, total };
  }
}

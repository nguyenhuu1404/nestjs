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
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma.service';
import { BaseRepository } from '@core/repositories/base.repository';
import { Role } from '@prisma/client';

@Injectable()
export class RolesRepository extends BaseRepository<Role, any, any> {
  protected model;
  constructor(private prisma: PrismaService) {
    super();
    this.model = this.prisma.role;
  }

  findByIds(ids: number[]) {
    return this.prisma.role.findMany({ where: { id: { in: ids } } });
  }
}

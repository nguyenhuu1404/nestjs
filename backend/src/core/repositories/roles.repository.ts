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

  findAll() {
    return this.prisma.role.findMany({
      include: { permissions: { include: { permission: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
      include: { permissions: { include: { permission: true } } },
    });
  }

  findByName(name: string) {
    return this.prisma.role.findUnique({ where: { name } });
  }

  createWithPermissions(
    data: { name: string; description?: string; isActive?: boolean },
    permissionIds?: number[],
  ) {
    return this.prisma.role.create({
      data: {
        ...data,
        permissions: permissionIds?.length
          ? { create: permissionIds.map((permissionId) => ({ permissionId })) }
          : undefined,
      },
      include: { permissions: { include: { permission: true } } },
    });
  }

  updateWithPermissions(id: number, data: any, permissionIds?: number[]) {
    return this.prisma.role.update({
      where: { id },
      data: {
        ...data,
        ...(permissionIds !== undefined && {
          permissions: { deleteMany: {}, create: permissionIds.map((permissionId) => ({ permissionId })) },
        }),
      },
      include: { permissions: { include: { permission: true } } },
    });
  }
}

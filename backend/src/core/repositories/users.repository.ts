// modules/users/users.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma.service';
import { BaseRepository } from '@core/repositories/base.repository';
import { User } from '@prisma/client';
import { CreateUserDto } from '@modules/users/v1/dto/create-user.dto';
import { UpdateUserDto } from '@modules/users/v1/dto/update-user.dto';

@Injectable()
export class UsersRepository extends BaseRepository<User, CreateUserDto & { password: string }, UpdateUserDto> {
  protected model;

  constructor(private prisma: PrismaService) {
    super();
    this.model = this.prisma.user; // gán Prisma delegate cho base dùng chung
  }

  // Method riêng của users, không có trong base — override include quan hệ roles
  findAll() {
    return this.prisma.user.findMany({
      include: { roles: { include: { role: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { roles: { include: { role: true } } },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  createWithRoles(data: { email: string; password: string; name?: string; isActive?: boolean }, roleIds?: number[]) {
    return this.prisma.user.create({
      data: {
        ...data,
        roles: roleIds?.length
          ? { create: roleIds.map((roleId) => ({ roleId })) } // tạo luôn UserRole trong cùng transaction
          : undefined,
      },
      include: { roles: { include: { role: true } } },
    });
  }

  updateWithRoles(id: number, data: any, roleIds?: number[]) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        // roleIds có mặt trong request -> xoá hết role cũ, gán lại theo danh sách mới (replace toàn bộ)
        ...(roleIds !== undefined && {
          roles: {
            deleteMany: {}, // xoá toàn bộ UserRole cũ của user này
            create: roleIds.map((roleId) => ({ roleId })),
          },
        }),
      },
      include: { roles: { include: { role: true } } },
    });
  }

  delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}

// modules/permissions/permissions.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PermissionsRepository } from '@core/repositories/permissions.repository';
import { PermissionMapper } from './mappers/permission.mapper';
import { CreatePermissionDto } from './v1/dto/create-permission.dto';
import { UpdatePermissionDto } from './v1/dto/update-permission.dto';
import { QueryPermissionDto } from './v1/dto/query-permission.dto';
import { PermissionEntity } from '@entities/permission.entity';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@core/constants/pagination.constant';

@Injectable()
export class PermissionsService {
  constructor(
    private permissionsRepository: PermissionsRepository,
    private permissionMapper: PermissionMapper,
  ) {}

  async findAll(query: QueryPermissionDto) {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_PAGE_SIZE;

    const { items, total } = await this.permissionsRepository.findAllPaginated({
      page,
      limit,
      name: query.name,
      module: query.module,
    });

    return {
      items: this.permissionMapper.toEntities(items),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<PermissionEntity> {
    const permission = await this.permissionsRepository.findById(id);
    if (!permission) throw new NotFoundException('Không tìm thấy permission');
    return this.permissionMapper.toEntity(permission);
  }

  async create(dto: CreatePermissionDto): Promise<PermissionEntity> {
    const existing = await this.permissionsRepository.findByName(dto.name);
    if (existing) throw new ConflictException('Permission name đã tồn tại');

    const permission = await this.permissionsRepository.create(dto);
    return this.permissionMapper.toEntity(permission);
  }

  async update(id: number, dto: UpdatePermissionDto): Promise<PermissionEntity> {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.permissionsRepository.findByName(dto.name);
      if (existing && existing.id !== id) throw new ConflictException('Permission name đã tồn tại');
    }

    const permission = await this.permissionsRepository.update(id, dto);
    return this.permissionMapper.toEntity(permission);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.permissionsRepository.delete(id);
  }
}

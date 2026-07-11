// modules/permissions/permissions.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PermissionsRepository } from '@core/repositories/permissions.repository';
import { PermissionMapper } from './mappers/permission.mapper';
import { CreatePermissionDto } from './v1/dto/create-permission.dto';
import { UpdatePermissionDto } from './v1/dto/update-permission.dto';
import { PermissionEntity } from '@entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    private permissionsRepository: PermissionsRepository,
    private permissionMapper: PermissionMapper,
  ) {}

  async findAll(): Promise<PermissionEntity[]> {
    const permissions = await this.permissionsRepository.findAll();
    return this.permissionMapper.toEntities(permissions);
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

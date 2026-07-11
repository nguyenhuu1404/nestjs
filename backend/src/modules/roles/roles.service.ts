// modules/roles/roles.service.ts
import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { RolesRepository } from '@core/repositories/roles.repository';
import { PermissionsRepository } from '@core/repositories/permissions.repository';
import { RoleMapper } from './mappers/role.mapper';
import { CreateRoleDto } from './v1/dto/create-role.dto';
import { UpdateRoleDto } from './v1/dto/update-role.dto';
import { RoleEntity } from '@entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    private rolesRepository: RolesRepository,
    private permissionsRepository: PermissionsRepository,
    private roleMapper: RoleMapper,
  ) {}

  private async validatePermissionIds(permissionIds?: number[]): Promise<void> {
    if (!permissionIds?.length) return;
    const found = await this.permissionsRepository.findByIds(permissionIds);
    if (found.length !== permissionIds.length) {
      const foundIds = found.map((p) => p.id);
      const missing = permissionIds.filter((id) => !foundIds.includes(id));
      throw new BadRequestException(`permissionId không tồn tại: ${missing.join(', ')}`);
    }
  }

  async findAll(): Promise<RoleEntity[]> {
    const roles = await this.rolesRepository.findAll();
    return this.roleMapper.toEntities(roles);
  }

  async findOne(id: number): Promise<RoleEntity> {
    const role = await this.rolesRepository.findById(id);
    if (!role) throw new NotFoundException('Không tìm thấy role');
    return this.roleMapper.toEntity(role);
  }

  async create(dto: CreateRoleDto): Promise<RoleEntity> {
    const existing = await this.rolesRepository.findByName(dto.name);
    if (existing) throw new ConflictException('Role name đã tồn tại');

    const { permissionIds, ...rest } = dto;
    await this.validatePermissionIds(permissionIds);

    const role = await this.rolesRepository.createWithPermissions(rest, permissionIds);
    return this.roleMapper.toEntity(role);
  }

  async update(id: number, dto: UpdateRoleDto): Promise<RoleEntity> {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.rolesRepository.findByName(dto.name);
      if (existing && existing.id !== id) throw new ConflictException('Role name đã tồn tại');
    }

    const { permissionIds, ...rest } = dto;
    await this.validatePermissionIds(permissionIds);

    const role = await this.rolesRepository.updateWithPermissions(id, rest, permissionIds);
    return this.roleMapper.toEntity(role);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.rolesRepository.delete(id);
  }
}

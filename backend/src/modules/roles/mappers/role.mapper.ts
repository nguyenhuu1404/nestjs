import { Injectable } from '@nestjs/common';
import { BaseMapper } from '@common/mappers/base.mapper';
import { RoleEntity } from '@entities/role.entity';

@Injectable()
export class RoleMapper extends BaseMapper<any, RoleEntity> {
  toEntity(role: any): RoleEntity {
    return new RoleEntity({
      ...role,
      permissions: role.permissions?.map((rp: any) => rp.permission.name) ?? [],
    });
  }
}

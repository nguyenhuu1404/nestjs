import { Injectable } from '@nestjs/common';
import { BaseMapper } from '@common/mappers/base.mapper';
import { PermissionEntity } from '@entities/permission.entity';

@Injectable()
export class PermissionMapper extends BaseMapper<any, PermissionEntity> {
  toEntity(permission: any): PermissionEntity {
    return new PermissionEntity(permission);
  }
}

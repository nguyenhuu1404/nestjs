import { Injectable } from '@nestjs/common';
import { BaseMapper } from '@common/mappers/base.mapper';
import { UserEntity } from '@entities/user.entity';

@Injectable()
export class UserMapper extends BaseMapper<any, UserEntity> {
  toEntity(user: any): UserEntity {
    return new UserEntity({
      ...user,
      roles: user.roles?.map((ur: any) => ur.role.name) ?? [],
    });
  }
}

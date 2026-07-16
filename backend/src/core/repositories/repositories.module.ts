import { Global, Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { RolesRepository } from './roles.repository';
import { PermissionsRepository } from './permissions.repository';
import { MediaRepository } from './media.repository';

@Global()
@Module({
  providers: [
    UsersRepository,
    RolesRepository,
    PermissionsRepository,
    MediaRepository,
  ],
  exports: [
    UsersRepository,
    RolesRepository,
    PermissionsRepository,
    MediaRepository,
  ],
})
export class RepositoriesModule {}

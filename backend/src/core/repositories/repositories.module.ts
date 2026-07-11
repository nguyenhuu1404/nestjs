import { Global, Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { RolesRepository } from './roles.repository';
import { PermissionsRepository } from './permissions.repository';

@Global()
@Module({
  providers: [UsersRepository, RolesRepository, PermissionsRepository],
  exports: [UsersRepository, RolesRepository, PermissionsRepository],
})
export class RepositoriesModule {}

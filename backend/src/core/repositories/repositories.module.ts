import { Global, Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { RolesRepository } from './roles.repository';

@Global()
@Module({
  providers: [UsersRepository, RolesRepository],
  exports: [UsersRepository, RolesRepository],
})
export class RepositoriesModule {}

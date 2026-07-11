import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './v1/roles.controller';
import { RoleMapper } from './mappers/role.mapper';

@Module({
  controllers: [RolesController],
  providers: [RolesService, RoleMapper],
  exports: [RolesService],
})
export class RolesModule {}

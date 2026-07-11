import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './v1/permissions.controller';
import { PermissionMapper } from './mappers/permission.mapper';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionMapper],
})
export class PermissionsModule {}

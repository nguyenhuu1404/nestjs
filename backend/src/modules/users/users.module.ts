import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './v1/users.controller';
import { UserMapper } from './mappers/user.mapper';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserMapper],
  exports: [UsersService],
})
export class UsersModule {}

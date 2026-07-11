import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z]+\.[a-z-]+$/, {
    message: 'name phải theo format module.action, ví dụ: users.create',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  module: string;

  @IsString()
  description?: string;
}

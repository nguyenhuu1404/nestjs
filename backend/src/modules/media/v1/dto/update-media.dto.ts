import { IsOptional, IsString } from 'class-validator';

export class UpdateMediaDto {
  @IsOptional() @IsString() fileName?: string;
  @IsOptional() @IsString() altText?: string;
}

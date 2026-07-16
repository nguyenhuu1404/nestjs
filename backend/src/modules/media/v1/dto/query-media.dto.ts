import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@core/constants/pagination.constant';

export class QueryMediaDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = DEFAULT_PAGE;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = DEFAULT_PAGE_SIZE;
  @IsOptional() @IsString() fileName?: string;
  @IsOptional() @IsString() folder?: string;
}

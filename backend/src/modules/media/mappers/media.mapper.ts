import { Injectable } from '@nestjs/common';
import { BaseMapper } from '@common/mappers/base.mapper';
import { MediaEntity } from '@entities/media.entity';

@Injectable()
export class MediaMapper extends BaseMapper<any, MediaEntity> {
  toEntity(media: any): MediaEntity {
    return new MediaEntity(media);
  }
}

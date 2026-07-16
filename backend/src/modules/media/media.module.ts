import { Module } from '@nestjs/common';
import { MediaController } from './v1/media.controller';
import { MediaService } from './media.service';
import { MediaMapper } from './mappers/media.mapper';

@Module({
  controllers: [MediaController],
  providers: [MediaService, MediaMapper],
  exports: [MediaService],
})
export class MediaModule {}

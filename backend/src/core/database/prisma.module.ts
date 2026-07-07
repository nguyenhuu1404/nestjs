import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // để mọi module dùng PrismaService không cần import lại — như DB facade global sẵn trong Laravel
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

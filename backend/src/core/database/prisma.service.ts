import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // tương đương Laravel tự connect DB lúc boot qua DB facade
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

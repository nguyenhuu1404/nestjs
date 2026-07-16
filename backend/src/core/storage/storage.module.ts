import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3StorageDriver } from './drivers/s3-storage.driver';
import { LocalStorageDriver } from './drivers/local-storage.driver';
import { STORAGE_DRIVER } from './storage.constants';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    S3StorageDriver,
    LocalStorageDriver,
    {
      provide: STORAGE_DRIVER,
      useFactory: (config: ConfigService, s3: S3StorageDriver, local: LocalStorageDriver) => {
        const driver = config.get<string>('STORAGE_DRIVER', 's3');
        return driver === 'local' ? local : s3;
      },
      inject: [ConfigService, S3StorageDriver, LocalStorageDriver],
    },
  ],
  exports: [STORAGE_DRIVER],
})
export class StorageModule {}

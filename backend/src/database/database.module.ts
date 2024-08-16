import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { FilesModule } from '../files/files.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [FilesModule, ConfigModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
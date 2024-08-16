import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { DatabaseModule } from '../database/database.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [DatabaseModule, FilesModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
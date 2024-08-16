import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { DatabaseService } from '../database/database.service';
import { FilesService } from '../files/files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('chatbot')
@UseGuards(JwtAuthGuard)
export class ChatbotController {
  constructor(
    private chatbotService: ChatbotService,
    private databaseService: DatabaseService,
    private filesService: FilesService
  ) {}

  @Get('database')
  async getUserDatabase(@Req() req: Request) {
    const userId = (req.user as any).userId;
    const databaseFile = await this.filesService.getUserDatabaseFile(userId);
    return databaseFile ? databaseFile.fileName : null;
  }

  @Post()
  async chat(@Body() body: { message: string }, @Req() req: Request) {
    const userId = (req.user as any).userId;
    const response = await this.chatbotService.processMessage(userId, body.message);
    return { reply: response };
  }
}
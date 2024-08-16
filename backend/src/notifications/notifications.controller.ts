import { Controller, Get, Put, Delete, Param, UseGuards, Request,Post,Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getAllNotifications(@Request() req) {
    return this.notificationsService.getAllNotifications(req.user.userId);
  }

  @Post()
  async createNotification(@Request() req, @Body() notificationData: { title: string, message: string, type: string }) {
    const userId = req.user.userId;
    return this.notificationsService.createNotification(userId, notificationData.title, notificationData.message, notificationData.type);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(+id, req.user.userId);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Request() req) {
    await this.notificationsService.deleteNotification(+id, req.user.userId);
    return { success: true };
  }
}
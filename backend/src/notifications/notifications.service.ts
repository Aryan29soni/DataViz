// src/notifications/notifications.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../users/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async getAllNotifications(userId: number): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: number, userId: number): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (notification) {
      notification.read = true;
      await this.notificationsRepository.save(notification);
    }
    return notification;
  }

  async deleteNotification(id: number, userId: number): Promise<void> {
    await this.notificationsRepository.delete({ id, user: { id: userId } });
  }

  async createNotification(userId: number, title: string, message: string, type: string): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      title,
      message,
      type,
      user: { id: userId } as User,
    });
    return this.notificationsRepository.save(notification);
  }

  async createDashboardGeneratedNotification(userId: number): Promise<Notification> {
    return this.createNotification(userId, 'Dashboard Generated', 'Your dashboard has been successfully generated.', 'success');
  }

  async createDashboardDownloadedNotification(userId: number): Promise<Notification> {
    return this.createNotification(userId, 'Dashboard Downloaded', 'Your dashboard has been downloaded as a screenshot.', 'info');
  }

  async createLoginNotification(userId: number): Promise<Notification> {
    const currentTime = new Date().toLocaleString();
    return this.createNotification(userId, 'Successful Login', `You logged in successfully at ${currentTime}.`, 'info');
  }

  async createFileUploadedNotification(userId: number, fileName: string): Promise<Notification> {
    return this.createNotification(userId, 'File Uploaded', `Your file "${fileName}" has been successfully uploaded.`, 'success');
  }
}
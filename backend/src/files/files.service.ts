import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { FileEntity } from './file.entity';
import * as fs from 'fs/promises';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
    private notificationsService: NotificationsService,
  ) {}

  async createFile(fileName: string, filePath: string, userId: number, mimeType: string): Promise<FileEntity> {
    const file = new FileEntity();
    file.fileName = fileName;
    file.filePath = filePath;
    file.mimeType = mimeType;
    file.user = { id: userId } as any;
    await this.notificationsService.createFileUploadedNotification(userId, fileName);
    return this.fileRepository.save(file);
  }

  async getFilesByUserId(userId: number): Promise<FileEntity[]> {
    return this.fileRepository.find({ where: { user: { id: userId } } });
  }

  async getUserDatabaseFile(userId: number): Promise<FileEntity | null> {
    return this.fileRepository.findOne({
      where: { 
        user: { id: userId },
        fileName: Like('%.sql')
      }
    });
  }

  async readFileContent(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      throw new NotFoundException(`File not found: ${filePath}`);
    }
  }

  async getFileByNameAndUserId(fileName: string, userId: number): Promise<FileEntity | null> {
    return this.fileRepository.findOne({ where: { fileName, user: { id: userId } } });
  }

  async deleteFile(fileId: number, userId: number): Promise<void> {
    const file = await this.fileRepository.findOne({ where: { id: fileId, user: { id: userId } } });
    if (file) {
      await this.fileRepository.remove(file);
    } else {
      throw new NotFoundException('File not found');
    }
  }
}
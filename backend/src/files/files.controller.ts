import { Controller, Get, Post, Delete, Param, UseGuards, Request, UseInterceptors, UploadedFile, ConflictException, NotFoundException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const fileName: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${fileName}${extension}`)
      }
    })
  }))
  async uploadFile(@UploadedFile() file, @Request() req) {
    const userId = req.user.userId;
    const { filename, path: filePath, mimetype } = file;
  

    if (mimetype === 'application/sql' || filename.toLowerCase().endsWith('.sql')) {
      const existingDatabase = await this.filesService.getUserDatabaseFile(userId);
      if (existingDatabase) {

        fs.unlinkSync(filePath);
        throw new ConflictException('A database file already exists. Please delete the existing one before uploading a new database.');
      }
    }
  
    return this.filesService.createFile(filename, filePath, userId, mimetype);
  }

  @Get()
  async getFiles(@Request() req) {
    const userId = req.user.userId;
    return this.filesService.getFilesByUserId(userId);
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: number, @Request() req) {
    const userId = req.user.userId;
    await this.filesService.deleteFile(id, userId);
    return { message: 'File deleted successfully' };
  }
}
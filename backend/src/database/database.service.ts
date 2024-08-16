import { Injectable } from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as csv from 'csv-parse/sync';

@Injectable()
export class DatabaseService {
  private connections: Map<number, any[]> = new Map();

  constructor(
    private filesService: FilesService,
    private configService: ConfigService
  ) {}

  async getUserDatabase(userId: number): Promise<string | null> {
    const userFile = await this.filesService.getUserDatabaseFile(userId);
    return userFile ? userFile.fileName : null;
  }

  async createConnection(userId: number, filePath: string): Promise<void> {
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const records = csv.parse(fileContent, {
        columns: true,
        skip_empty_lines: true
      });
      this.connections.set(userId, records);
    } catch (error) {
      throw new Error(`Failed to parse CSV file: ${error.message}`);
    }
  }

  async ensureConnection(userId: number): Promise<void> {
    if (!this.connections.has(userId)) {
      const databaseFile = await this.filesService.getUserDatabaseFile(userId);
      if (!databaseFile) {
        throw new Error('No database file found for this user');
      }
      await this.createConnection(userId, databaseFile.filePath);
    }
  }

  async executeQuery(userId: number, query: string): Promise<any[]> {
    await this.ensureConnection(userId);
    const data = this.connections.get(userId);
    if (!data) {
      throw new Error('Failed to retrieve user data');
    }

 
    const [, conditions] = query.toLowerCase().split('where');
    if (!conditions) {
      return data;
    }

    return data.filter(row => {
      const [field, operator, value] = conditions.trim().split(/\s+/);
      switch (operator) {
        case '>':
          return parseFloat(row[field]) > parseFloat(value);
        case '<':
          return parseFloat(row[field]) < parseFloat(value);
        case '=':
          return row[field] == value;
        default:
          return true;
      }
    });
  }
}
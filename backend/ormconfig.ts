import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { User } from './src/users/user.entity';
import { FileEntity } from './src/files/file.entity';
import { Notification } from './src/notifications/notification.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, FileEntity, Notification],
  migrations: [join(__dirname, 'src', 'migrations', '*{.ts,.js}')],
  synchronize: false,
  logging: true,
});
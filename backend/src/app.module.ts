import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ReportsModule } from './reports/reports.module';
import { FileEntity } from './files/file.entity';
import { FilesModule } from './files/files.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"dataViz" <${process.env.EMAIL_USER}>`,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User,FileEntity,Notification],
      synchronize: false, 
      extra: {
        authPlugin: 'mysql_native_password',
      },
    }),
    MulterModule.register({
      dest: '/uploads',
    }),
    AuthModule,
    UsersModule,
    ReportsModule,
    FilesModule,
    ChatbotModule,
    DatabaseModule,
    NotificationsModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

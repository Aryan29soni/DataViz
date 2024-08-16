// src/mailer/mailer.module.ts
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

export const mailerModule = MailerModule.forRoot({
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
    from: `"No Reply" <${process.env.EMAIL_USER}>`,
  },
  template: {
    dir: join(__dirname, '../template'), 
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
});

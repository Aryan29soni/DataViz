// src/auth/dto/create-reset.dto.ts
import { IsEmail } from 'class-validator';

export class CreateResetDto {
  @IsEmail()
  email: string;
}

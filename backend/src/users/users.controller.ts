import { Controller, Post, Body, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signUp(@Body('email') email: string, @Body('password') password: string) {
    try {
      const user = await this.usersService.create(email, password);
      return { id: user.id, email: user.email };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new BadRequestException('User already exists');
      }
      throw error;
    }
  }
}

import { Controller, Post, Body, Get, Param, Res, NotFoundException,Put, Delete, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { CreateResetDto } from './dto/create-reset.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { UsersService } from '../users/users.service';
import { UpdateOrganizationDto } from './dto/user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @Post('forgot-password')
  async forgotPassword(@Body() createResetDto: CreateResetDto) {
    try {
      await this.authService.sendResetLink(createResetDto);
      return { message: 'Reset link sent successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      console.log('Login attempt:', loginDto.email);
      const result = await this.authService.login(loginDto);
      console.log('Login result:', result);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('analyze/:fileName')
  async analyzeFile(@Param('fileName') fileName: string, @Request() req): Promise<any> {
    const userId = req.user.userId;
    const filePath = await this.authService.getFile(fileName, userId);
    return this.authService.processTextData(filePath);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-info')
  async getUserInfo(@Request() req) {
    return this.usersService.getUserInfo(req.user.userId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Put('update-organization')
  async updateOrganization(@Request() req, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.usersService.updateOrganization(req.user.userId, updateOrganizationDto.organization);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('send-support-email')
  async sendSupportEmail(@Body() emailData: { email: string; subject: string; message: string }) {
    return this.authService.sendSupportEmail(emailData);
  }


  @UseGuards(JwtAuthGuard)
  @Get('download-file/:fileName')
  async downloadFile(@Param('fileName') fileName: string, @Res() res: Response, @Request() req) {
    const userId = req.user.userId;
    const filePath = await this.authService.getFile(fileName, userId);
    if (!filePath) {
      throw new NotFoundException('File not found');
    }
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    res.download(filePath);
  }

  @UseGuards(JwtAuthGuard)
  @Get('files')
  getFiles(@Request() req) {
    const userId = req.user.userId;
    return this.authService.getFiles(userId);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {}

  

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    const { access_token } = await this.authService.googleLogin(req.user);

    res.redirect(`http://localhost:5173/auth/callback?token=${access_token}`);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-file/:fileName')
  async deleteFile(@Param('fileName') fileName: string, @Request() req) {
    const userId = req.user.userId;
    await this.authService.deleteFile(fileName, userId);
    return { message: 'File deleted successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('reports/:fileName')
  async generateReport(@Param('fileName') fileName: string, @Request() req): Promise<any> {
    const userId = req.user.userId;
    const filePath = await this.authService.getFile(fileName, userId);
    const data = await this.authService.generateReport(filePath);
    return data;
  }
}
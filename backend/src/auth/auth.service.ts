import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { FilesService } from '../files/files.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateResetDto } from './dto/create-reset.dto';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import { existsSync, unlinkSync } from 'fs';
import { LoginDto } from './dto/login.dto';
import * as path from 'path';
import * as xlsx from 'xlsx';
import { ConfigService } from '@nestjs/config';
import { FileEntity } from 'src/files/file.entity';
import * as natural from 'natural';
import * as fs from 'fs';
import Sentiment from 'sentiment';
import mammoth from 'mammoth';
import { PDFExtract } from 'pdf.js-extract';
import { createWorker } from 'tesseract.js';
import pdfParse from 'pdf-parse';
import * as pdfImgConvert from 'pdf-img-convert';
import { DatabaseService } from 'src/database/database.service';




@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;
  private tokenizer = new natural.WordTokenizer();
  private sentiment: any = new (Sentiment as any)();
  private pdfExtract: PDFExtract;


  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    this.pdfExtract = new PDFExtract();
  }



  private async extractTextFromPDF(filePath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      
      if (pdfData.text.trim()) {
        return pdfData.text;
      } else {
        return this.performOCROnPDF(filePath);
      }
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      return this.performOCROnPDF(filePath);
    }
  }

  async sendSupportEmail(emailData: { email: string; subject: string; message: string }) {
    try {
      await this.transporter.sendMail({
        from: `"DataViz Support" <${process.env.EMAIL_USER}>`,
        to: 'yoyoaryansoni@gmail.com', 
        subject: `Support Request: ${emailData.subject}`,
        html: `
          <h1>New Support Request</h1>
          <p><strong>From:</strong> ${emailData.email}</p>
          <p><strong>Subject:</strong> ${emailData.subject}</p>
          <h2>Message:</h2>
          <p>${emailData.message}</p>
        `,
      });
      return { message: 'Email sent successfully' };
    } catch (error) {
      console.error('Error sending support email:', error);
      throw new Error('Failed to send support email');
    }
  }

  async uploadDatabase(file: Express.Multer.File, userId: number): Promise<any> {
    try {

      const savedFile = await this.filesService.createFile(file.filename, file.path, userId, file.mimetype);
  
      await this.databaseService.createConnection(userId, file.path);

      return {
        message: 'Database uploaded and connected successfully',
        file: savedFile
      };
    } catch (error) {

      if (existsSync(file.path)) {
        unlinkSync(file.path);
      }
      throw new BadRequestException(`Failed to upload database: ${error.message}`);
    }
  }

  private async performOCROnPDF(filePath: string): Promise<string> {
    try {
      const pdfPages = await pdfImgConvert.convert(filePath, {
        width: 2000,
        height: 2000,
        page_numbers: [1],
        base64: false
      });
      
      const tempImagePath = path.join(__dirname, '..', '..', 'temp_image.png');
      fs.writeFileSync(tempImagePath, pdfPages[0]);

      const text = await this.performOCR(tempImagePath);

      fs.unlinkSync(tempImagePath);

      return text;
    } catch (error) {
      console.error('Error performing OCR on PDF:', error);
      throw new Error('Failed to perform OCR on PDF');
    }
  }

  private async performOCR(filePath: string): Promise<string> {
    const worker = await createWorker();
    try {
      const { data: { text } } = await worker.recognize(filePath);
      await worker.terminate();
      return text;
    } catch (error) {
      console.error('OCR Error:', error);
      await worker.terminate();
      throw new Error('Failed to extract text using OCR');
    }
  }

  private async extractTextFromFile(filePath: string): Promise<string> {
    const fileExtension = path.extname(filePath).toLowerCase();
    
    if (fileExtension === '.pdf') {
      return this.extractTextFromPDF(filePath);
    } else if (fileExtension === '.docx') {
      return this.extractTextFromWord(filePath);
    } else {
      return this.extractTextFromPlainFile(filePath);
    }
  }


  private async extractTextFromWord(filePath: string): Promise<string> {
    try {
      const result = await mammoth.extractRawText({path: filePath});
      return result.value;
    } catch (error) {
      console.error('Error extracting text from Word document:', error);
      throw new Error('Failed to extract text from Word document');
    }
  }


  async processTextData(filePath: string): Promise<any> {
    const text = await this.extractTextFromFile(filePath);
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/);

    const wordFrequency = this.getWordFrequency(words);
    const sentimentScore = this.getSentiment(text);

    return {
      sentiment: sentimentScore,
      wordFrequency: wordFrequency,
      textStructure: {
        sentenceCount: sentences.length,
        wordCount: words.length,
        averageWordsPerSentence: words.length / sentences.length || 0,
      },
      rawText: text,
    };
  }



  private async extractTextFromPlainFile(filePath: string): Promise<string> {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error('Error reading plain text file:', error);
      throw new Error('Failed to read plain text file');
    }
  }




  private getSentiment(text: string): number {
    const result = this.sentiment.analyze(text);
    return result.score / Math.max(result.words.length, 1);
  }
  
  private getWordFrequency(words: string[]): { [key: string]: number } {
    return words.reduce((acc, word) => {
      word = word.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (word.length > 1) {
        acc[word] = (acc[word] || 0) + 1;
      }
      return acc;
    }, {});
  }


  async uploadFile(file: Express.Multer.File, userId: number): Promise<FileEntity> {
    return this.filesService.createFile(file.filename, file.path, userId, file.mimetype);
  }


  async getFile(fileName: string, userId: number): Promise<string | null> {
    const file = await this.filesService.getFileByNameAndUserId(fileName, userId);
    if (file && existsSync(file.filePath)) {
      return file.filePath;
    }
    throw new NotFoundException('File not found');
  }

  async getFiles(userId: number): Promise<any[]> {
    return this.filesService.getFilesByUserId(userId);
  }

  async deleteFile(fileName: string, userId: number): Promise<void> {
    const file = await this.filesService.getFileByNameAndUserId(fileName, userId);
    if (file) {
      unlinkSync(file.filePath);
      await this.filesService.deleteFile(file.id, userId);
    } else {
      throw new NotFoundException('File not found');
    }
  }

  async saveFile(file: Express.Multer.File, userId: number): Promise<FileEntity> {
    return this.filesService.createFile(file.filename, file.path, userId, file.mimetype);
  }

  async generateReport(filePath: string): Promise<any> {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    return {
      generalData: this.prepareChartData(jsonData),
      monthWiseData: this.prepareMonthWiseData(jsonData),
    };
  }

  private prepareMonthWiseData(data: any[]): any {
    const monthWiseData = {};
    const industries = ['automotive', 'fashion', 'health', 'entertainment', 'electronics'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    months.forEach(month => {
      monthWiseData[month] = {};
      industries.forEach(industry => {
        monthWiseData[month][industry] = {};
      });
    });

    data.forEach(row => {
      const month = row['Month'];
      industries.forEach(industry => {
        Object.keys(row).forEach(column => {
          if (column.toLowerCase().includes(industry)) {
            if (!monthWiseData[month][industry][column]) {
              monthWiseData[month][industry][column] = 0;
            }
            monthWiseData[month][industry][column] += parseFloat(row[column]) || 0;
          }
        });
      });
    });

    return monthWiseData;
  }

  private prepareChartData(data: any[]): any[] {
    const charts = [];
    const dataStructure: { [key: string]: { [key: string]: number } } = {};

    data.forEach(row => {
      Object.keys(row).forEach(column => {
        if (!dataStructure[column]) {
          dataStructure[column] = {};
        }
        const value = row[column];
        if (typeof value === 'string' || typeof value === 'number') {
          dataStructure[column][value] = (dataStructure[column][value] || 0) + 1;
        }
      });
    });

    Object.keys(dataStructure).forEach(column => {
      const chartData: [string, any][] = [['Element', 'Count']];
      Object.entries(dataStructure[column]).forEach(([key, value]) => {
        chartData.push([key, value]);
      });

      charts.push({
        type: this.determineChartType(column, chartData as [string, number][]),
        data: chartData,
        title: `Distribution of ${column}`
      });
    });

    return charts;
  }

  private determineChartType(column: string, data: [string, any][]): string {
    if (column.toLowerCase().includes('country')) return 'PieChart';
    if (column.toLowerCase().includes('birthdate')) return 'BarChart';
    if (column.toLowerCase().includes('age')) return 'BarChart';
    if (column.toLowerCase().includes('price')) return 'LineChart';
    if (column.toLowerCase().includes('sales')) return 'ColumnChart';
    if (column.toLowerCase().includes('revenue')) return 'AreaChart';
    if (column.toLowerCase().includes('performance')) return 'Gauge';
    if (column.toLowerCase().includes('distribution')) return 'Histogram';
    if (column.toLowerCase().includes('relationship')) return 'ScatterChart';
    if (column.toLowerCase().includes('profit')) return 'LineChart';
    if (column.toLowerCase().includes('expenses')) return 'ColumnChart';
    if (column.toLowerCase().includes('growth')) return 'LineChart';
    if (column.toLowerCase().includes('inventory')) return 'BarChart';
    if (column.toLowerCase().includes('customer')) return 'PieChart';
    if (column.toLowerCase().includes('satisfaction')) return 'BarChart';
    if (column.toLowerCase().includes('engagement')) return 'AreaChart';
    if (column.toLowerCase().includes('traffic')) return 'LineChart';
    if (column.toLowerCase().includes('clicks')) return 'ScatterChart';
    if (column.toLowerCase().includes('impressions')) return 'ColumnChart';
    if (column.toLowerCase().includes('conversion')) return 'PieChart';
    if (column.toLowerCase().includes('retention')) return 'LineChart';
    if (column.toLowerCase().includes('churn')) return 'Histogram';
    if (column.toLowerCase().includes('orders')) return 'BarChart';
    if (column.toLowerCase().includes('deliveries')) return 'BarChart';
    if (column.toLowerCase().includes('returns')) return 'BarChart';
    if (column.toLowerCase().includes('views')) return 'ColumnChart';
    if (column.toLowerCase().includes('sessions')) return 'LineChart';
    if (column.toLowerCase().includes('visits')) return 'LineChart';
    if (column.toLowerCase().includes('ratings')) return 'ColumnChart';
    return 'PieChart'; 
  }



  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, newPassword, resetToken } = resetPasswordDto;
    const user = await this.usersService.findByEmail(email);
    if (!user || user.resetToken !== resetToken || user.resetTokenExpiry < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await this.usersService.update(user.id, user);
  }
  
  
  
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    console.log(`Attempting login for email: ${email}`);
    const user = await this.validateUser(email, password);
    if (!user) {
      console.log(`Login failed for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log(`Login successful for email: ${email}`);
    const payload = { email: user.email, sub: user.id };
    console.log('JWT_SECRET:', this.configService.get<string>('JWT_SECRET'));
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
    };
  }
  
  async validateUser(email: string, pass: string): Promise<any> {
    console.log(`Validating user: ${email}`);
    const user = await this.usersService.findByEmail(email);
    if (user) {
      console.log(`User found: ${email}`);

      
      const isMatch = user.password === pass;
      console.log(`Password match: ${isMatch}`);
      if (isMatch) {
        console.log(`Login successful for: ${email}`);
        const { password, ...result } = user;
        return result;
      } else {
        console.log(`Password incorrect for: ${email}`);
      }
    } else {
      console.log(`User not found: ${email}`);
    }
    return null;
  }

  async validateGoogleUser(details: any) {
    const { email, googleId } = details;
    let user = await this.usersService.findByEmail(email);

    if (user) {

      if (!user.googleId) {
        user = await this.usersService.update(user.id, { googleId });
      }
    } else {

      user = await this.usersService.create(email, uuidv4(), details);
    }

    return user;
  }

  async googleLogin(user: any) {
    if (!user) {
      throw new UnauthorizedException('No user from Google');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
    };
  }

  


  async sendResetLink(createResetDto: CreateResetDto): Promise<void> {
    const { email } = createResetDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('No user found with this email');
    }

    const resetToken = uuidv4();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); 

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;

    await this.usersService.update(user.id, user);

    try {
      const resetLink = `http://localhost:5173/forgot-password?token=${resetToken}`;
      const mailOptions = {
        from: `"No Reply" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Reset Request',
        html: `<p>Hello,</p>
               <p>You requested a password reset. Click the link below to reset your password:</p>
               <p><a href="${resetLink}">Reset Password</a></p>
               <p>If you did not request a password reset, please ignore this email.</p>
               <p>Thanks,</p>
               <p>dataviz</p>`,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Reset link sent to ${email}: ${resetLink}`);
    } catch (error) {
      throw new Error(`Could not send reset email to ${email}`);
    }
  }
}
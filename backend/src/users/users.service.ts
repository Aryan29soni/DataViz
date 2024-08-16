import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(email: string, password: string, details?: any): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const newUser = this.userRepository.create({ 
      email, 
      password,
      googleId: details?.googleId,
      firstName: details?.firstName,
      lastName: details?.lastName,
      picture: details?.picture
    });
    return await this.userRepository.save(newUser);
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }


  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updateOrganization(id: number, organization: string): Promise<User> {
    await this.userRepository.update(id, { organization });
    return this.userRepository.findOne({ where: { id } });
  }

  async getUserInfo(id: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['files'],
    });
    return {
      email: user.email,
      password: user.password, 
      filesCount: user.files.length,
      organization: user.organization,
    };
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }
}

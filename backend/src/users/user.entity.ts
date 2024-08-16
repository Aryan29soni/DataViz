import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FileEntity } from '../files/file.entity';
import { Notification } from '../notifications/notification.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  resetTokenExpiry: Date;

  @OneToMany(() => FileEntity, file => file.user)
  files: FileEntity[];

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  organization: string;

  
  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];
}
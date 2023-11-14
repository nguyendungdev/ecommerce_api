import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '@payments/entities/payment.entity';
import { Order } from '@orders/entities/order.entity';
import { Review } from '@reviews/entities/review.entity';
import { Session } from '@sessions/entities/session.entity';
import { Forgot } from '@forgot/entities/forgot.entity';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Role } from '../roles.enum';

@Entity({
  name: 'user',
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'example@gmail.com', description: 'Email of user' })
  @Column({ name: 'email', type: 'varchar', unique: true })
  email: string;

  @ApiProperty({ example: 'Admin123@', description: 'Password of user' })
  @Exclude()
  @Column({ name: 'password', type: 'varchar', nullable: true })
  password: string;

  @Column({
    name: 'roles',
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.User],
    nullable: false,
  })
  roles: Role[];

  @Exclude()
  @Column({ name: 'salt', nullable: true })
  salt: string;

  @Exclude()
  @Column({ name: 'is_confirmed', default: false })
  is_confirmed: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ name: 'delete_at', type: 'timestamp', nullable: true })
  delete_at: Date;

  @OneToMany(() => Payment, (payment) => payment.user_id, {
    cascade: true,
  })
  payments: Payment[];

  @OneToMany(() => Review, (review) => review.user, {
    cascade: true,
  })
  reviews: Review[];

  @OneToMany(() => Order, (order) => order.user, {
    cascade: true,
  })
  orders: Order[];

  @OneToMany(() => Forgot, (forgot) => forgot.user)
  forgot: Forgot[];

  @OneToMany(() => Order, (order) => order.user, {
    cascade: true,
  })
  sessions: Session[];

  async validatePassword(password: string): Promise<boolean> {
    const hashPassword = await bcrypt.compare(password, this.password);
    return hashPassword;
  }
}

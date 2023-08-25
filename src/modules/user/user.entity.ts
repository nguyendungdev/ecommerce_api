import {
   Entity,
   Column,
   CreateDateColumn,
   UpdateDateColumn,
   PrimaryGeneratedColumn,
   BaseEntity,
   DeleteDateColumn,
   OneToMany,
   JoinColumn,
   OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Role } from './roles.enum';
import { Payment } from '../payment/payment.entity';
import { Order } from '../order/order.entity';

@Entity({
   name: 'users',
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
   isConfirmed: boolean;

   @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
   createdAt: Date;

   @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
   updatedAt: Date;

   @DeleteDateColumn({ name: 'delete_at', type: 'timestamp', nullable: true })
   deleteAt: Date;

   @OneToMany(() => Payment, (payment) => payment.userId, {
      cascade: true,
   })
   payment: Payment[];

   @OneToMany(() => Order, (order) => order.user, {
      cascade: true,
   })
   orders: Order[];

   async validatePassword(password: string): Promise<boolean> {
      const hashPassword = await bcrypt.compare(password, this.password);
      return hashPassword;
   }
}

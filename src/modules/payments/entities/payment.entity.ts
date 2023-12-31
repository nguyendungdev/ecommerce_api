import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@users/entities/user.entity';
import { Invoice } from '@invoices/entities/invoice.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../payment-method.enum';

@Entity({ name: 'payment' })
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'expiry', type: 'date' })
  @ApiProperty({
    example: '2022-01-01',
    description: 'The expiry date of the payment',
  })
  @Column({ name: 'expiry', type: 'timestamp' })
  expiry: Date;

  @ApiProperty({
    example: 'Stripe',
    description: 'The provider of the payment',
  })
  @Column({ name: 'provider', type: 'varchar' })
  prodiver: string;

  @ApiProperty({
    example: 123456789,
    description: 'The account number for the payment',
  })
  @Column({ name: 'acount_no', type: 'varchar' })
  acount_no: number;

  @ApiProperty({
    example: 'Credit Card',
    description: 'The payment method',
  })
  @Column({ name: 'payment_method' })
  payment_method: PaymentMethod;

  @ApiProperty({
    example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
    description: 'The ID of the related user',
  })
  @Column({ name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, (user) => user.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Invoice, (invoice) => invoice.payment)
  invoice: Invoice;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ name: 'delete_at', type: 'timestamp', nullable: true })
  delete_at: Date;
}

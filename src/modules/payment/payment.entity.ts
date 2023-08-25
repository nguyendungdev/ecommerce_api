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
import { PaymentMethod } from './payment-method.enum';
import { User } from '../user/user.entity';
import { Invoice } from '../invoice/invoice.entity';
import { ApiProperty } from '@nestjs/swagger';
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
   acountNo: number;

   @ApiProperty({
      example: 'Credit Card',
      description: 'The payment method',
   })
   @Column({ name: 'payment_method' })
   paymentMethod: PaymentMethod;

   @ApiProperty({
      example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
      description: 'The ID of the related user',
   })
   @Column({ name: 'user_id' })
   userId: string;

   @ManyToOne(() => User, (user) => user.payment, {
      onDelete: 'CASCADE',
   })
   @JoinColumn({ name: 'user_id' })
   user: User;

   @OneToOne(() => Invoice, (invoice) => invoice.payment)
   invoice: Invoice;

   @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
   createdAt: Date;

   @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
   updatedAt: Date;

   @DeleteDateColumn({ name: 'delete_at', type: 'timestamp', nullable: true })
   deleteAt: Date;
}

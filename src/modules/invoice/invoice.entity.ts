import {
   Entity,
   BaseEntity,
   PrimaryGeneratedColumn,
   Column,
   Unique,
   OneToOne,
   ManyToOne,
   JoinColumn,
   CreateDateColumn,
   UpdateDateColumn,
   DeleteDateColumn,
} from 'typeorm';
import { Payment } from '../payment/payment.entity';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity('invoice')
export class Invoice extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @ApiProperty({ example: 'INV-20230714', description: 'Invoice number' })
   @Column({ name: 'number', type: 'varchar' })
   number: string;

   @ApiProperty({ example: 'INV-20230714', description: 'Order id' })
   @Column({ name: 'order_id', type: 'uuid' })
   orderId: string;

   @ApiProperty({ example: 50, description: 'Total price' })
   @Column({ name: 'invoice_total', type: 'numeric' })
   invoiceTotal: number;

   @ApiProperty({ example: '2023-07-14', description: 'Invoice date' })
   @Column({ name: 'invoice_date', type: 'date' })
   invoiceDate: Date;

   @ApiProperty({ example: '2023-07-21', description: 'Due date' })
   @Column({ name: 'due_date', type: 'date' })
   dueDate: Date;

   @ApiProperty({ example: '2023-07-21 12:00:00', description: 'Payment date' })
   @Column({ name: 'payment_date', type: 'timestamp' })
   paymentDate: Date;

   @ApiProperty({
      example: 'da400369-2342-42c1-980f-17d3519267aa',
      description: `Payment's id`,
   })
   @Column({ name: 'payment_id', type: 'uuid' })
   paymentId: string;

   @JoinColumn({ name: 'payment_id' })
   @OneToOne(() => Payment, (payment) => payment.invoice, {
      onDelete: 'CASCADE',
   })
   payment: Payment;

   @JoinColumn({ name: 'order_id' })
   @OneToOne(() => Order, (order) => order.invoice, {
      onDelete: 'CASCADE',
   })
   order: Order;

   @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
   createdAt: Date;

   @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
   updatedAt: Date;

   @DeleteDateColumn({ name: 'delete_at', type: 'timestamp', nullable: true })
   deleteAt: Date;
}

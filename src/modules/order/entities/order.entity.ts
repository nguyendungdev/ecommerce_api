import {
   Entity,
   BaseEntity,
   PrimaryGeneratedColumn,
   Column,
   ManyToOne,
   ManyToMany,
   JoinTable,
   OneToMany,
   OneToOne,
   JoinColumn,
   DeleteDateColumn,
   CreateDateColumn,
   UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { OrderStatus } from '../order-status.enum';
import { OrderItem } from './oder-item.entity';
import { Invoice } from '../../invoice/entities/invoice.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity('order')
export class Order extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({
      name: 'order_date',
      default: new Date(),
   })
   @ApiProperty({
      example: '2022-01-01T00:00:00Z',
      description: 'The date of the order',
   })
   order_date: Date;

   @Column({
      default: 'PROCESSED',
   })
   @ApiProperty({
      example: 'PROCESSED',
      description: 'The status of the order',
   })
   status: OrderStatus;

   @Column({
      name: 'shipment_date',
      nullable: true,
      type: 'timestamp',
   })
   @ApiProperty({
      example: '2022-01-05T00:00:00Z',
      description: 'The shipment date of the order',
   })
   shipment_date: string;

   @Column({ name: 'comment', type: 'varchar', nullable: true })
   @ApiProperty({
      example: 'Some comments',
      description: 'Comments for the order',
   })
   comment: string;

   @Column({ name: 'shipped_to' })
   @ApiProperty({
      example: 'Ha Noi',
      description: 'The name of the recipient',
   })
   shipped_to: string;

   @Column({ name: 'user_id' })
   @ApiProperty({
      example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
      description: 'The ID of the related user',
   })
   user_id: string;

   @JoinColumn({ name: 'user_id' })
   @ManyToOne(() => User, (user) => user.orders, {
      onDelete: 'CASCADE',
   })
   user: User;

   @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
      cascade: true,
   })
   order_item: OrderItem;

   @OneToOne(() => Invoice, (invoice) => invoice.order, {
      cascade: true,
   })
   invoice: Invoice;

   @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
   created_at: Date;

   @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
   updated_at: Date;

   @DeleteDateColumn({ name: 'delete_at', type: 'timestamp', nullable: true })
   delete_at: Date;
}

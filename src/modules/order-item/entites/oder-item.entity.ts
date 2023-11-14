import {
  PrimaryGeneratedColumn,
  Entity,
  BaseEntity,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '@products/entities/product.entity';
import { Order } from '@orders/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('order_item')
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 5,
    description: 'The quantity of the product in the order item',
  })
  @Column({
    nullable: true,
  })
  quantity: number;

  @ApiProperty({
    example: 100,
    description: 'The total price of the order item',
  })
  @Column({ name: 'total_price', type: 'numeric' })
  total_price: number;

  @Column({ name: 'product_id' })
  @ApiProperty({
    example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
    description: 'The ID of the related product',
  })
  product_id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ name: 'delete_at', type: 'timestamp', nullable: true })
  delete_at: Date;

  @JoinColumn({ name: 'product_id' })
  @ManyToOne(() => Product, (product) => product.order_items, {
    onDelete: 'CASCADE',
  })
  product: Product[];

  @ApiProperty({
    example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
    description: 'The ID of the related order',
  })
  @Column({ name: 'order_id' })
  order_id: string;

  @JoinColumn({ name: 'order_id' })
  @ManyToOne(() => Order, (order) => order.order_item, {
    onDelete: 'CASCADE',
  })
  order: Order[];
}

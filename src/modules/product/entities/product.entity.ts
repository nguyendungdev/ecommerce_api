import {
   Entity,
   Column,
   PrimaryGeneratedColumn,
   BaseEntity,
   CreateDateColumn,
   UpdateDateColumn,
   DeleteDateColumn,
   OneToMany,
   OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from '../../../modules/order/entities/oder-item.entity';
import { Review } from '../../../modules/review/entities/review.entity';
import { CategoryProduct } from './category-product.entity';

@Entity({
   name: 'product',
})
export class Product extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @ApiProperty({
      example: 'Product Name',
      description: 'The name of the product',
   })
   @Column({ name: 'name' })
   name: string;

   @ApiProperty({
      example: 'img_url',
      description: 'The picture of the product',
   })
   @Column({ name: 'img_url' })
   img_url: string;

   @ApiProperty({
      example: 200,
      description: 'The base price of the product',
   })
   @Column({ name: 'base_price' })
   base_price: number;

   @ApiProperty({
      example: 200,
      description: 'The total review of the product',
   })
   @Column({ name: 'total_review', default: 0 })
   total_review: number;

   @ApiProperty({
      example: 0,
      description: 'The product discount in percentage',
   })
   @Column({ name: 'discount_percentage' })
   discount_percentage: number;

   @ApiProperty({
      example: '',
      description: "The product's description",
   })
   @Column({ name: 'description' })
   description: string;

   @ApiProperty({ example: 30, description: `stock` })
   @Column({ name: 'stock' })
   stock: number;

   @CreateDateColumn({ name: 'created_at' })
   created_at: Date;
   @UpdateDateColumn({ name: 'updated_at' })
   updated_at: Date;
   @DeleteDateColumn({ name: 'delete_at' })
   delete_at: Date;

   @OneToMany(() => CategoryProduct, (c) => c.product, {
      cascade: true,
   })
   category_product: CategoryProduct[];

   @OneToOne(() => Review, (review) => review.product, {
      cascade: true,
   })
   review: Review;

   @OneToMany(() => OrderItem, (orderItem) => orderItem.product, {
      cascade: true,
   })
   order_items: OrderItem[];
}

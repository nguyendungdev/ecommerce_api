import {
   Entity,
   Column,
   PrimaryGeneratedColumn,
   BaseEntity,
   CreateDateColumn,
   UpdateDateColumn,
   ManyToOne,
   DeleteDateColumn,
   JoinColumn,
   OneToMany,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from '../order/oder-item.entity';

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
   @Column({ name: 'picture' })
   imgUrl: string;

   @ApiProperty({
      example: 200,
      description: 'The base price of the product',
   })
   @Column({ name: 'base_price' })
   basePrice: number;

   @ApiProperty({
      example: 0,
      description: 'The product discount in percentage',
   })
   @Column({ name: 'discount_percentage' })
   discountPercentage: number;

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
   createdAt: Date;
   @UpdateDateColumn({ name: 'updated_at' })
   updatedAt: Date;
   @DeleteDateColumn({ name: 'delete_at' })
   deleteAt: Date;

   @ManyToOne(() => Category, (category) => category.products, {
      onDelete: 'CASCADE',
   })
   @JoinColumn({ name: 'category_id' })
   category: Category;

   @ApiProperty({
      example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
      description: 'The ID of the related category',
   })
   @Column({ name: 'category_id' })
   categoryId: string;

   @OneToMany(() => OrderItem, (orderItem) => orderItem.product, {
      cascade: true,
   })
   orderItems: OrderItem[];
}

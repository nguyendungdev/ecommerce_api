import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@categories/entities/category.entity';
import { Product } from '@products/entities/product.entity';

@Entity({
  name: 'category_product',
})
export class CategoryProduct extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '',
    description: `product's id`,
  })
  @Column({ name: 'product_id', type: 'uuid', nullable: false })
  product_id: string;

  @ApiProperty({
    example: '',
    description: `category's id`,
  })
  @Column({ name: 'category_id', type: 'uuid', nullable: false })
  category_id: string;

  @ManyToOne(() => Product, (product) => product.category_product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Category, (category) => category.categoryProduct, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ name: 'delete_at', type: 'timestamp', nullable: true })
  delete_at: Date;
}

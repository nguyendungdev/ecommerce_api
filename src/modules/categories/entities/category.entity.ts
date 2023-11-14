import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryProduct } from 'src/modules/category-product/entities/category-product.entity';

@Entity({
  name: 'category',
})
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'example name', description: 'Name of product' })
  @Column({ name: 'name', type: 'varchar', unique: true, nullable: false })
  name: string;

  @ApiProperty({ description: `Product's description` })
  @Column({ name: 'description', type: 'varchar', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ name: 'delete_at', type: 'timestamp', nullable: true })
  delete_at: Date;

  @OneToMany(() => CategoryProduct, (c) => c.category, {
    cascade: true,
  })
  categoryProduct: CategoryProduct[];
}

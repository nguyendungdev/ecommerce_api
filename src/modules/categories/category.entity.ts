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
import { Product } from '../product/product.entity';

@Entity({
   name: 'category',
})
export class Category extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @ApiProperty({ example: 'ln', description: 'Name of product' })
   @Column({ name: 'name', type: 'varchar', nullable: false })
   name: string;

   @ApiProperty({ description: `Product's description` })
   @Column({ name: 'description', type: 'varchar', nullable: false })
   description: string;

   @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
   createdAt: Date;

   @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
   updatedAt: Date;

   @DeleteDateColumn({ name: 'delete_at', type: 'timestamp', nullable: true })
   deleteAt: Date;

   @OneToMany(() => Product, (product) => product.category, {
      cascade: true,
   })
   products: Product[];
}

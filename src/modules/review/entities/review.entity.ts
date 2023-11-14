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
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Rating } from './rating.entity';
import { Product } from '../../product/entities/product.entity';

@Entity({ name: 'reviews' })
export class Review extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @ApiProperty({
      example: 'Stripe',
      description: 'The provider of the review',
   })
   @Column({ name: 'comment', type: 'text' })
   comment: string;

   @ApiProperty({
      example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
      description: 'The ID of the related product',
   })
   @Column({ name: 'product_id', type: 'uuid' })
   product_id: string;

   @ApiProperty({
      example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
      description: 'The ID of the related rating',
   })
   @Column({ name: 'ratings_id', type: 'uuid' })
   rating_id: string;

   @ApiProperty({
      example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
      description: 'The ID of the related user',
   })
   @Column({ name: 'user_id', type: 'uuid' })
   user_id: string;

   @JoinColumn({ name: 'user_id' })
   @ManyToOne(() => User, (user) => user.review, {
      onDelete: 'CASCADE',
   })
   user: User;

   @OneToOne(() => Rating, (rating) => rating.review, {
      onDelete: 'CASCADE',
   })
   rating: Rating;

   @OneToOne(() => Product, (product) => product.review, {
      onDelete: 'CASCADE',
   })
   product: Product;

   @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
   created_at: Date;

   @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
   updated_at: Date;

   @DeleteDateColumn({ name: 'delete_at', type: 'timestamp', nullable: true })
   delete_at: Date;
}

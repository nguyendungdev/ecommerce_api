import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Review } from './review.entity';

@Entity({ name: 'rating' })
export class Rating extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 123456789,
    description: 'The account number for the review',
  })
  @Column({ name: 'rating_point', type: 'float' })
  rating_point: number;

  @OneToOne(() => Review, (review) => review.rating, {
    cascade: true,
  })
  review: Review;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ name: 'delete_at', type: 'timestamp', nullable: true })
  delete_at: Date;
}

import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@users/entities/user.entity';

@Entity({
  name: 'session',
})
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @ApiProperty({
    example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
    description: 'The ID of the related user',
  })
  user_id: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @DeleteDateColumn({ name: 'delete_at', type: 'timestamp', nullable: true })
  delete_at: Date;
}

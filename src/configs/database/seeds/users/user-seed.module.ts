import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeedService } from './user-seed.service';
import { User } from '@users/entities/user.entity';
import { UsersRepository } from '@users/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserSeedService, UsersRepository],
  exports: [UserSeedService],
})
export class UserSeedModule {}

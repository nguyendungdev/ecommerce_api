import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UsersRepository } from './user.repository';

@Module({
   imports: [TypeOrmModule.forFeature([User])],
   providers: [UserService, UsersRepository],
   exports: [UserService],
   controllers: [UserController],
})
export class UserModule {}

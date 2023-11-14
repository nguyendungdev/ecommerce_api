import { NotFoundException } from '@nestjs/common';
import { CommonMessage } from '../../common/constants/messages.constants';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository extends Repository<User> {
   constructor(private dataSource: DataSource) {
      super(User, dataSource.createEntityManager());
   }
   async findOneById(id: string): Promise<User> {
      const user = await this.findOneBy({ id: id });
      if (!user) {
         throw new NotFoundException(CommonMessage.NOT_FOUND_BY_ID);
      }
      return user;
   }
}

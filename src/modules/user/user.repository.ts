import { NotFoundException } from '@nestjs/common';
import { CommonMessage } from '../../common/constants/messages.constants';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository extends Repository<User> {
   async findOneById(id: string): Promise<User> {
      const user = await this.findOneBy({ id: id });
      if (!user) {
         throw new NotFoundException(CommonMessage.NOT_FOUND_BY_ID);
      }
      return user;
   }
}

import {
   ConflictException,
   HttpStatus,
   Injectable,
   InternalServerErrorException,
   NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CommonMessage } from 'src/common/constants/messages.constants';
import * as bcrypt from 'bcrypt';
import AuthCreadentialsDto from 'src/auth/dto/auth-credentials.dto';
import { UsersRepository } from './user.repository';
import UserRespondDto from './dto/user-response.dto';
import UsersResponseDto from './dto/users-response.dto';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
   constructor(
      @InjectRepository(User)
      private readonly usersRepository: UsersRepository,
   ) {}

   async getAll(): Promise<UsersResponseDto> {
      console.log('get all service');
      const users = await this.usersRepository.find({
         where: {
            deleteAt: null,
         },
      });
      return { users };
   }
   async getById(id: string): Promise<UserRespondDto> {
      const user = await this.usersRepository.findOneById(id);
      return user;
   }

   async getByEmail(email: string): Promise<User> {
      const user = await this.usersRepository.findOne({
         where: {
            email,
         },
      });
      if (!user) {
         return null;
      }
      return user;
   }

   async getInfo(email: string) {
      const user = await this.usersRepository.findOne({
         where: {
            email,
         },
      });
      if (!user) {
         return null;
      }
      return {
         roles: user.roles,
         isConfirmed: user.isConfirmed,
      };
   }

   async update(id: string, editUserDto: EditUserDto): Promise<User> {
      const { email, password } = editUserDto;
      const existUser = await this.usersRepository.findOneById(id);
      if (!existUser) {
         throw new NotFoundException(CommonMessage.NOT_FOUND_BY_ID);
      }
      existUser.email = email ? email : existUser.email;

      if (password) {
         const salt = await bcrypt.genSalt();
         const hashPassword = await bcrypt.hash(password, salt);
         existUser.salt = salt;
         existUser.password = hashPassword;
      }
      await existUser.save();
      return existUser;
   }

   async create(authCreadentialsDto: AuthCreadentialsDto): Promise<void> {
      const { email, password, roles } = authCreadentialsDto;
      if (await this.getByEmail(email)) {
         throw new ConflictException(`Email ${CommonMessage.ALREADY_EXIST}`);
      }
      const newUser = this.usersRepository.create();
      newUser.email = email;

      if (password) {
         const salt = await bcrypt.genSalt();
         const hashPassword = await bcrypt.hash(password, salt);
         newUser.salt = salt;
         newUser.password = hashPassword;
      } else {
         newUser.salt = null;
         newUser.password = null;
      }
      if (roles) {
         newUser.roles = roles;
      }

      try {
         await newUser.save();
      } catch (error) {
         if (error.code === '23505') {
            // Duplicate email.
            throw new ConflictException(`Email ${CommonMessage.ALREADY_EXIST}`);
         }
         throw new InternalServerErrorException(error);
      }
   }

   async markEmailAsConfirmed(email: string) {
      return this.usersRepository.update(
         { email },
         {
            isConfirmed: true,
         },
      );
   }
}

import {
   ConflictException,
   Injectable,
   InternalServerErrorException,
   NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CommonMessage } from 'src/common/constants/messages.constants';
import * as bcrypt from 'bcrypt';
import AuthCreadentialsDto from 'src/auth/dto/auth-credentials.dto';
import { UsersRepository } from './user.repository';
import UserRespondDto from './dto/user-response.dto';
import UsersResponseDto from './dto/users-response.dto';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
   constructor(private readonly usersRepository: UsersRepository) {}
   /**
    * Get all users.
    *
    * @returns UsersResponseDto - A list of users.
    */
   async getAll(): Promise<UsersResponseDto> {
      console.log('get all service');
      const users = await this.usersRepository.find({
         where: {
            delete_at: null,
         },
      });
      return { users };
   }

   /**
    * Get user information by ID.
    *
    * @param id string - ID of the user.
    * @returns UserRespondDto - User information or null if not found.
    */
   async getById(id: string): Promise<UserRespondDto> {
      const user = await this.usersRepository.findOneById(id);
      if (!user) {
         return null;
      }
      return user;
   }

   /**
    * Get user information by email.
    *
    * @param email string - Email address of the user.
    * @returns User - User information or null if not found.
    */
   async getByEmail(email: string): Promise<User> {
      const user = await this.usersRepository.findOne({
         where: {
            email,
            is_confirmed: true,
            delete_at: null,
         },
      });
      if (!user) {
         return null;
      }
      return user;
   }

   /**
    * Get user information by email.
    *
    * @param email string - Email address of the user.
    * @returns object - Role and confirmation status (isConfirmed) of the user or null if not found.
    */
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
         isConfirmed: user.is_confirmed,
      };
   }

   /**
    * Update user information.
    *
    * @param id string - ID of the user to be updated.
    * @param editUserDto EditUserDto - User information updates.
    * @returns User - User information after the update.
    */
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

   /**
    * Create a new user.
    *
    * @param authCreadentialsDto AuthCreadentialsDto - user registration information.
    */
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

   /**
    * Mark an email as confirmed.
    *
    * @param email string - Email address to be marked as confirmed.
    * @returns UpdateResult - Update result.
    */
   async markEmailAsConfirmed(email: string) {
      return this.usersRepository.update(
         { email },
         {
            is_confirmed: true,
         },
      );
   }
}

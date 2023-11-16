import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CommonMessage } from '@common/constants/messages.constants';
import * as bcrypt from 'bcrypt';
import AuthCreadentialsDto from '@auth/dto/auth-credentials.dto';
import { Session } from '@sessions/entities/session.entity';
import { UsersRepository } from './user.repository';
import UsersResponseDto from './dto/users-response.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { UsersMessage } from './user.constants';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAll(): Promise<UsersResponseDto> {
    const users = await this.usersRepository.getAll();
    if (!users) {
      throw new NotFoundException(`No user`);
    }
    return users;
  }

  async getById(id: User['id']): Promise<User> {
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException(CommonMessage.NOT_FOUND_BY_ID);
    }
    return user;
  }

  async getBySessionId(id: Session['id']): Promise<User> {
    const user = await this.usersRepository.findBySessionId(id);
    if (!user) {
      throw new NotFoundException(CommonMessage.NOT_FOUND_BY_ID);
    }
    return user;
  }

  async getByEmail(email: User['email']): Promise<User> {
    const user = await this.usersRepository.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(UsersMessage.NOT_FOUND_EMAIL);
    }
    return user;
  }

  async getInfo(email: User['email']) {
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

  async create(authCreadentialsDto: AuthCreadentialsDto): Promise<User> {
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
        throw new ConflictException(`Email ${CommonMessage.ALREADY_EXIST}`);
      }
      throw new InternalServerErrorException(error);
    }
    return newUser;
  }

  async markEmailAsConfirmed(email: string) {
    return this.usersRepository.update(
      { email },
      {
        is_confirmed: true,
      },
    );
  }
}

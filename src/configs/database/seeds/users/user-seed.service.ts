import { Injectable } from '@nestjs/common';
import { Role } from '@users/roles.enum';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '@users/user.repository';

@Injectable()
export class UserSeedService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async run() {
    const countAdmin = await this.usersRepository.findByRole(Role.Admin);
    if (countAdmin == 0) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);
      await this.usersRepository.save(
        await this.usersRepository.create({
          id: 'c5b67e2b-cef7-4139-9375-dc011024c02d',
          email: 'admin@example.com',
          password: password,
          roles: [Role.Admin, Role.Seller, Role.User],
          is_confirmed: true,
          salt: salt,
        }),
      );
    }
    const countUser = await this.usersRepository.findByRole(Role.User);
    if (countUser == 0) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('123456@Abc', salt);
      await this.usersRepository.save(
        await this.usersRepository.create({
          id: 'c5b67e2b-cef7-4139-9375-dc011024c03d',
          email: 'example@test.com',
          password: password,
          roles: [Role.User],
          is_confirmed: true,
          salt: salt,
        }),
      );
    }
  }
}

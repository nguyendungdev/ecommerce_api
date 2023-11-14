import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { NullableType } from '@common/types/nullable.type';
import { Session } from '@sessions/entities/session.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async getAll() {
    const user = await this.query(`
        select id,email,is_confirmed,roles
        from "user"
        where delete_at is null;`);
    if (!user || user.length === 0) {
      return null;
    }
    return user;
  }
  async findOneById(id: User['id']): Promise<User> {
    const user = await this.query(
      `
        select id
        from "user"
        where id = $1
        and delete_at is null
        limit 1; 
    `,
      [id],
    );
    if (!user || user.length === 0) {
      return null;
    }
    return user;
  }

  async findBySessionId(id: Session['id']) {
    const user = await this.query(
      `
        select u.id
        from "user" u
        inner join session s on u.id = s.user_id
        where s.id = $1
        and u.delete_at is null
        limit 1; 
    `,
      [id],
    );
    if (!user || user.length === 0) {
      return null;
    }
    return user;
  }

  async findByRole(role: string): Promise<number> {
    const result = await this.query(`
         select count(*)
         from "user"
         where '${role}' = any(roles)
      `);
    return result[0].count;
  }
  async findOneByEmail(email: User['email']): Promise<NullableType<User>> {
    const user = await this.query(
      `
        select id,email,is_confirmed,roles,password,salt
        from "user"
        where delete_at is null
        and email = $1
        limit 1;`,
      [email],
    );
    if (!user || user.length === 0) {
      return null;
    }
    return this.createUserFromData(user[0]);
  }
  private createUserFromData(userData: any): User {
    const user = new User();
    user.id = userData.id;
    user.email = userData.email;
    user.password = userData.password;
    user.is_confirmed = userData.is_confirmed;
    user.roles = userData.roles;
    return user;
  }
}

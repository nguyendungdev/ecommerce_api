import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Session } from './entities/session.entity';
import { SessionResponseDto } from './dto/session-response.dto';
@Injectable()
export class SessionRepository extends Repository<Session> {
  constructor(private dataSource: DataSource) {
    super(Session, dataSource.createEntityManager());
  }
  async getOne(id: string): Promise<SessionResponseDto> {
    const session = await this.query(`
        select u.roles,u.email
        from session ss
        inner join "user" u on u.id = ss.user_id
        where ss.id = '${id}'
        `);
    return session;
  }
}

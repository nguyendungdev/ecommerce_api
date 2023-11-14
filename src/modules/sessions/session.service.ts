import { Injectable } from '@nestjs/common';
import { Not } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { Session } from './entities/session.entity';
import { SessionRepository } from './session.repository';
import { SessionResponseDto } from './dto/session-response.dto';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async create(userId: Session['user_id']): Promise<Session> {
    return this.sessionRepository.save(
      this.sessionRepository.create({ user_id: userId }),
    );
  }

  async findOne(id: Session['id']): Promise<SessionResponseDto> {
    const session = await this.sessionRepository.getOne(id);
    return session;
  }

  async softDelete({
    excludeId,
    ...criteria
  }: {
    id?: Session['id'];
    user_id?: User['id'];
    excludeId?: Session['id'];
  }): Promise<void> {
    await this.sessionRepository.softDelete({
      ...criteria,
      id: criteria.id ? criteria.id : excludeId ? Not(excludeId) : undefined,
    });
  }
}

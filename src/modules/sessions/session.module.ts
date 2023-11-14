import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';
import { SessionRepository } from './session.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionService, SessionRepository],
  exports: [SessionService],
})
export class SessionModule {}

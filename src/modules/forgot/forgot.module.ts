import { Module } from '@nestjs/common';
import { ForgotService } from './forgot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForgotRepository } from './forgot.repository';
import { Forgot } from './entities/forgot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Forgot])],
  providers: [ForgotService, ForgotRepository],
  exports: [ForgotService],
})
export class ForgotModule {}

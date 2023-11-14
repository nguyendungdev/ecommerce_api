import { Injectable } from '@nestjs/common';
import { NullableType } from '@common/types/nullable.type';
import { Forgot } from './entities/forgot.entity';
import { ForgotRepository } from './forgot.repository';

@Injectable()
export class ForgotService {
  constructor(private readonly forgotRepository: ForgotRepository) {}

  async findOne(hash: string): Promise<NullableType<Forgot>> {
    return this.forgotRepository.findOneByHash(hash);
  }

  async create(hash: string, userId: string): Promise<Forgot> {
    return this.forgotRepository.save(
      this.forgotRepository.create({
        hash,
        user_id: userId,
      }),
    );
  }

  async softDelete(id: Forgot['id']): Promise<void> {
    await this.forgotRepository.softDelete(id);
  }
}

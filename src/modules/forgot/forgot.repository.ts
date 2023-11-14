import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { NullableType } from '@common/types/nullable.type';
import { Forgot } from './entities/forgot.entity';

@Injectable()
export class ForgotRepository extends Repository<Forgot> {
  constructor(private dataSource: DataSource) {
    super(Forgot, dataSource.createEntityManager());
  }
  async findOneByHash(hash: string): Promise<NullableType<Forgot>> {
    const forgot = await this.query(
      `   select id,user_id
          from forgot fg
          where hash = $1
          limit 1;`,
      [hash],
    );
    if (!forgot) {
      return null;
    }
    return forgot;
  }
}

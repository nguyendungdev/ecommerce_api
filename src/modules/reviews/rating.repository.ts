import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common/decorators';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingRepository extends Repository<Rating> {
  constructor(private dataSource: DataSource) {
    super(Rating, dataSource.createEntityManager());
  }
}

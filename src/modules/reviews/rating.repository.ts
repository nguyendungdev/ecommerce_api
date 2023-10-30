import { Repository, DataSource } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { Injectable } from '@nestjs/common/decorators';

@Injectable()
export class RatingRepository extends Repository<Rating> {
   constructor(private dataSource: DataSource) {
      super(Rating, dataSource.createEntityManager());
   }
}

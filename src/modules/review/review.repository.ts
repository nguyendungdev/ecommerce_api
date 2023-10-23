import { Repository, DataSource } from 'typeorm';
import { Review } from './entities/review.entity';
import { Injectable } from '@nestjs/common/decorators';
import { Rating } from './entities/rating.entity';
import { ReviewInfoDTO } from './dto/review-info.dto';

@Injectable()
export class ReviewRepository extends Repository<Review> {
   constructor(private dataSource: DataSource) {
      super(Review, dataSource.createEntityManager());
   }

   async findByIdAndPaginate(
      productId: Review['product_id'],
      page: number,
   ): Promise<ReviewInfoDTO[]> {
      const offset = 10;
      const reviews = await this.manager.query(`
            select u.email,r.rating_point,rv.comment
            from reviews rv
            inner join users u on u.id = rv.user_id
            inner join ratings r on r.id = rv.ratings_id
            where rv.product_id = '${productId}'
            and rv.delete_at is null
            limit ${offset}
            offset ${(page - 1) * offset}
        `);
      return reviews;
   }

   async averageRatingPoint(productId: Review['product_id']): Promise<number> {
      const point = this.manager.query(`
            select SUM(r.rating_point) / p.total_review AS average_rating
            from product p
            left join reviews re ON  p.id = re.product_id
            left join ratings r  ON  re.ratings_id = r.id
            where p.id ='${productId}'
            and p.delete_at is null
            GROUP BY p.id
        `);
      return point;
   }

   async getByReviewId(id: Review['id']): Promise<ReviewInfoDTO> {
      const point = await this.manager.query(`
            select u.email,r.rating_point,rv.comment
            from reviews rv
            inner join users u on u.id = rv.user_id
            inner join ratings r on r.id = rv.ratings_id
            and rv.delete_at is null
            where rv.id = '${id}'
      `);
      return point;
   }
}

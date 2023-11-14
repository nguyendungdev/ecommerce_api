import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common/decorators';
import { Review } from './entities/review.entity';
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
            from review rv
            inner join user u on u.id = rv.user_id
            inner join rating r on r.id = rv.rating_id
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
            left join review re ON  p.id = re.product_id
            left join rating r  ON  re.rating_id = r.id
            where p.id ='${productId}'
            and p.delete_at is null
            GROUP BY p.id
        `);
    return point;
  }

  async getByReviewId(id: Review['id']): Promise<ReviewInfoDTO> {
    const point = await this.manager.query(`
            select u.email,r.rating_point,rv.comment
            from review rv
            inner join user u on u.id = rv.user_id
            inner join rating r on r.id = rv.rating_id
            and rv.delete_at is null
            where rv.id = '${id}'
      `);
    return point;
  }
}

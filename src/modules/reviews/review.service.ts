import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { CreateReviewDTO } from './dto/create-review.dto';
import { ProductService } from '../products/product.service';
import { Review } from './entities/review.entity';
import { ReviewInfoDTO } from './dto/review-info.dto';
import { UpdateReviewDTO } from './dto/update-review.dto';
import { RatingRepository } from './rating.repository';

@Injectable()
export class ReviewService {
   constructor(
      private readonly reviewRepository: ReviewRepository,
      private readonly productService: ProductService,
      private readonly ratingRepository: RatingRepository,
   ) {}
   async create(createReviewDto: CreateReviewDTO): Promise<void> {
      const newReview = await this.reviewRepository.create(createReviewDto);
      await this.reviewRepository.save(newReview);
      const point = await this.reviewRepository.getByReviewId(newReview.id);
      await this.productService.newReviewAdd(
         newReview.product_id,
         point[0].rating_point,
      );
   }
   async getAll(): Promise<Review[]> {
      const reviews = await this.reviewRepository.find();
      return reviews;
   }

   async getReviewByIDPaginate(
      productId: Review['product_id'],
      page: number,
   ): Promise<ReviewInfoDTO[]> {
      const reviews = await this.reviewRepository.findByIdAndPaginate(
         productId,
         page,
      );
      return reviews;
   }

   async averageReviewRate(productId: Review['product_id']): Promise<number> {
      const point = await this.reviewRepository.averageRatingPoint(productId);
      return point;
   }

   async update(
      id: Review['id'],
      updateReviewDto: UpdateReviewDTO,
   ): Promise<void> {
      await this.reviewRepository.update(id, updateReviewDto);
   }

   async delete(id: Review['id']): Promise<void> {
      await this.reviewRepository.softDelete(id);
   }

   async restore(id: Review['id']): Promise<void> {
      await this.reviewRepository.restore(id);
   }
}

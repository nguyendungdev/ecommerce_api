import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewController } from './review.controller';
import { Rating } from './entities/rating.entity';
import { ProductModule } from '../products/product.module';
import { ReviewRepository } from './review.repository';
import { Product } from '../products/entities/product.entity';
import { RatingRepository } from './rating.repository';

@Module({
   imports: [
      TypeOrmModule.forFeature([Review, Rating, Product]),
      ProductModule,
   ],
   providers: [ReviewService, ReviewRepository, RatingRepository],
   exports: [ReviewService],
   controllers: [ReviewController],
})
export class ReviewModule {}

import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewController } from './review.controller';
import { Rating } from './entities/rating.entity';
import { ProductModule } from '../product/product.module';
import { ReviewRepository } from './review.repository';
import { Product } from '../product/entities/product.entity';

@Module({
   imports: [
      TypeOrmModule.forFeature([Review, Rating, Product]),
      ProductModule,
   ],
   providers: [ReviewService, ReviewRepository],
   exports: [ReviewService],
   controllers: [ReviewController],
})
export class ReviewModule {}

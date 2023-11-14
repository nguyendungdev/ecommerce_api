import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryProductService } from './category-product.service';
import { CategoryProduct } from './entities/category-product.entity';
import { CategoryProductRepository } from './category-product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryProduct])],
  providers: [CategoryProductService, CategoryProductRepository],
  exports: [CategoryProductService],
})
export class CategoryProductModule { }

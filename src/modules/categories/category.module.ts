import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryProductRepository } from '@category-product/category-product.repository';
import { Category } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category,])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, CategoryProductRepository],
  exports: [CategoryService],
})
export class CategoryModule { }

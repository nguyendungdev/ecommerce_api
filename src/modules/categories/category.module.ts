import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { CategoryRepository } from './category.repository';
import { CategoryProductRepository } from '../products/category-product.repository';
import { CategoryProduct } from '../products/entities/category-product.entity';
@Module({
   imports: [TypeOrmModule.forFeature([Category, Product, CategoryProduct])],
   controllers: [CategoryController],
   providers: [CategoryService, CategoryRepository, CategoryProductRepository],
   exports: [CategoryService],
})
export class CategoryModule {}

import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CategoryProduct } from './entities/category-product.entity';
import { CategoryProductRepository } from './category-product.repository';
@Module({
   imports: [TypeOrmModule.forFeature([Product, Category, CategoryProduct])],
   controllers: [ProductController],
   exports: [ProductService],
   providers: [ProductService, ProductRepository, CategoryProductRepository],
})
export class ProductModule {}

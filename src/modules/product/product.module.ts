import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
@Module({
   imports: [TypeOrmModule.forFeature([Product, Category])],
   controllers: [ProductController],
   exports: [ProductService],
   providers: [ProductService, ProductRepository],
})
export class ProductModule { }

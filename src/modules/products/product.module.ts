import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryProductModule } from '@category-product/category-product.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { Product } from './entities/product.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoryProductModule],
  controllers: [ProductController],
  exports: [ProductService],
  providers: [ProductService, ProductRepository],
})
export class ProductModule { }

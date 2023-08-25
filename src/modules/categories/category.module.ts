import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Product } from '../product/product.entity';
@Module({
   imports: [TypeOrmModule.forFeature([Category, Product])],
   controllers: [CategoryController],
   providers: [CategoryService],
   exports: [CategoryService],
})
export class CategoryModule { }

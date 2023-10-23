import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CategoryProduct } from './entities/category-product.entity';

@Injectable()
export class CategoryProductRepository extends Repository<CategoryProduct> {
   constructor(private dataSource: DataSource) {
      super(CategoryProduct, dataSource.createEntityManager());
   }
}

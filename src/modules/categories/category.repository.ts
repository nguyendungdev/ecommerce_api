import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
   constructor(private dataSource: DataSource) {
      super(Category, dataSource.createEntityManager());
   }

   async getAll() {
      const categories = await this.query(`select * from category`);
      return categories;
   }

   async getByName(name: string) {
      const category = await this.query(
         `select * from category 
         where name = '${name}' 
         and delete_at is null
         limit 1;`,
      );
      return category;
   }
}

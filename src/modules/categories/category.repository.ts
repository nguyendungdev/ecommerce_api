import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { NullableType } from '@common/types/nullable.type';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async getAll(page: number): Promise<NullableType<Category[]>> {
    const limit = 10;
    const productSkip = (page - 1) * limit;
    const categories = await this.query(
      `
      select name,description
      from category
      where delete_at is null 
      limit $1
      offset $2
    `,
      [limit, productSkip],
    );
    return categories;
  }
  async countCategory() {
    const categories = await this.query(
      `
      select count(name)
      from category
    `,
    );
    return categories[0];
  }

  async getByName(name: string): Promise<NullableType<Category>> {
    const category = await this.query(
      `select name,description from category
        where lower(name) = lower($1)
        and delete_at is null
        limit 1`,
      [name],
    );
    return category;
  }
}

import { CategoryProductRepository } from '@category-product/category-product.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryProductSeedService {
  constructor(
    private readonly categoryProductRepository: CategoryProductRepository,
  ) {}
  async run() {
    const count = await this.categoryProductRepository.count();
    if (count == 0) {
      await this.categoryProductRepository.save([
        this.categoryProductRepository.create({
          id: 'd97e3aba-41b4-4518-b453-bd872ca6db55',
          product_id: 'f3c83053-ea79-4877-9892-3c2ce26d864e',
          category_id: '817c1392-bf1e-4a95-a67b-4a3ffd12f79d',
        }),
      ]);
    }
  }
}

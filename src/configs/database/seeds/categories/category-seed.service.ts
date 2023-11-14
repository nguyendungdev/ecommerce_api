import { CategoryRepository } from '@categories/category.repository';
import { CategoryProductRepository } from '@category-product/category-product.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategorySeedService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
    ) { }
    async run() {
        const category = await this.categoryRepository.countCategory();
        if (category.count == 0) {
            await this.categoryRepository.save(
                [
                    this.categoryRepository.create({
                        id: '817c1392-bf1e-4a95-a67b-4a3ffd12f79d',
                        name: 'Example category\'s name',
                        description: 'Example category\'s description'
                    })
                ]
            )
        }
    }
}

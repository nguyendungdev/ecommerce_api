import { Injectable } from '@nestjs/common';
import { CategoryProductRepository } from './category-product.repository';
import { CategoryProduct } from './entities/category-product.entity';

@Injectable()
export class CategoryProductService {
    constructor(private readonly categoryProductRepository: CategoryProductRepository,
    ) { }

    async create(productId: CategoryProduct['product_id'], categoryId: CategoryProduct['category_id']): Promise<void> {
        await this.categoryProductRepository.save(
            await this.categoryProductRepository.create({
                product_id: productId,
                category_id: categoryId,
            }),
        );
    }
    async softDelete(productId: CategoryProduct['product_id']): Promise<void> {
        await this.categoryProductRepository.softDelete({ product_id: productId })
    }

    async findByProductId(productId: CategoryProduct['product_id']): Promise<CategoryProduct[]> {
        const result = await this.categoryProductRepository.findBy({
            product_id: productId
        })
        return result
    }

    async update(productId: CategoryProduct['product_id'], categoryId: CategoryProduct['category_id']): Promise<void> {
        await this.categoryProductRepository.update({
            product_id: productId
        }, {
            category_id: categoryId
        })
    }
}

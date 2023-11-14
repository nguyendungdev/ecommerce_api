import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryProductRepository } from '@category-product/category-product.repository';
import { CategoryProduct } from '@category-product/entities/category-product.entity';
import { CategoryProductSeedService } from './category-product-seed.service';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryProduct])],
    providers: [CategoryProductRepository, CategoryProductSeedService],
    exports: [CategoryProductSeedModule],
})
export class CategoryProductSeedModule {

}

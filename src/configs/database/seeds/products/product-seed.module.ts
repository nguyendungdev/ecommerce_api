import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@products/entities/product.entity';
import { ProductRepository } from '@products/product.repository';
import { ProductSeedService } from './product-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductSeedService, ProductRepository],
  exports: [ProductSeedModule],
})
export class ProductSeedModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@categories/entities/category.entity';
import { CategoryRepository } from '@categories/category.repository';
import { CategorySeedService } from './category-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategorySeedService, CategoryRepository],
  exports: [CategorySeedModule],
})
export class CategorySeedModule {}

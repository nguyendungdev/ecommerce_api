import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { UserSeedService } from './users/user-seed.service';
import { CategorySeedService } from './categories/category-seed.service';
import { ProductSeedService } from './products/product-seed.service';
import { CategoryProductSeedService } from './category-product/category-product-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);
  await app.get(UserSeedService).run();
  await app.get(CategorySeedService).run();
  await app.get(ProductSeedService).run();
  await app.get(CategoryProductSeedService).run();
  await app.close();
};
void runSeed();

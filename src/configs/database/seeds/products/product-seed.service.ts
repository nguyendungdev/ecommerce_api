import { ProductRepository } from '@products/product.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductSeedService {
  constructor(private readonly ProductRepository: ProductRepository) {}
  async run() {
    const product = await this.ProductRepository.count();
    if (!product) {
      await this.ProductRepository.save([
        await this.ProductRepository.create({
          id: '04a3ac64-03ca-4b22-af34-c47943e47176',
          name: 'Product Name 1',
          base_price: 200,
          discount_percentage: 0,
          img_url: 'img_url',
          stock: 30,
          description: '',
        }),
        await this.ProductRepository.create({
          id: 'f3c83053-ea79-4877-9892-3c2ce26d864e',
          name: 'Product Name 2',
          base_price: 200,
          discount_percentage: 10,
          img_url: 'img_url',
          stock: 40,
          description: '',
        }),
      ]);
    }
  }
}

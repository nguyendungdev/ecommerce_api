import { Repository, DataSource } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDTO } from './dto/create-product.dto';
import { Injectable } from '@nestjs/common/decorators';
import { FilterProductDTO } from './dto/filter-product.dto';
@Injectable()
export class ProductRepository extends Repository<Product> {
   async createProduct(createProductDTO: CreateProductDTO): Promise<any> {
      return;
   }

   async updateById(id: number): Promise<Product[]> {
      const product = await this.manager.query(`
        update product
        set 
        where id = ${id}
        returning *;
        `);
      return product;
   }

   async findByIdAndUpdate(
      id: string,
      createProductDTO: CreateProductDTO,
   ): Promise<Product> {
      const rawData = await this.manager.query(`select * from users`);
      return rawData;
   }
}

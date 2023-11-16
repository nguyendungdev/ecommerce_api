import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common/decorators';
import { ProductInfoDTO } from './dto/product-info.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async getPriceById(productId: Product['id']): Promise<number> {
    const product = await this.manager.query(
      `
         select base_price - product.base_price * product.discount_percentage as total_price
         from product
         where id = $1;
      `,
      [productId],
    );
    const totalPrice: number = product[0].total_price;
    return totalPrice;
  }

  async getQuantity(productId: Product['id']): Promise<number> {
    const product = await this.manager.query(
      `
         select stock
         from product
         where id = $1;
      `,
      [productId],
    );
    const totalPrice: number = product[0].stock;
    return totalPrice;
  }

  async getProductPaginate(
    findOption: string,
    page: number,
  ): Promise<ProductInfoDTO[]> {
    const limit = 10;
    const productSkip = (page - 1) * limit;
    const product = await this.manager.query(`
      select p.name,
       p.img_url,
       p.description,
       p.stock,
       p.description,
       p.base_price - p.base_price * p.discount_percentage as price,
       array_agg(cp.id) AS cp_ids
       from product p
       inner join category_product cp on p.id = cp.product_id
       ${findOption}
       group by  p.name,p.img_url,p.description,p.stock,p.description,price
       limit ${limit}
       offset ${productSkip};
      `);
    return product;
  }

  async updateNewReview(id: Product['id'], point: number) {
    await this.manager.query(
      `
         update product
         set total_review = total_review + $1
         where id = $2;
      `,
      [id, point],
    );
  }
}

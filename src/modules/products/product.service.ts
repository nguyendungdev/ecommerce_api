import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { CategoryProductService } from '@category-product/category-product.service';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductInfoDTO } from './dto/product-info.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryProductService: CategoryProductService,
  ) {}

  private formatUrlName(name: string) {
    const lowerCaseName = name.toLocaleLowerCase();
    const trimmedName = lowerCaseName.trim();
    const singleSpaceName = trimmedName.replace(/\s\s+/g, ' ');
    const spaceToHyphenName = singleSpaceName.split(' ').join('-');
    return spaceToHyphenName;
  }

  async getQuantityInStock(productId: Product['id']): Promise<number> {
    const quantity = await this.productRepository.getQuantity(productId);
    if (!quantity) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return quantity;
  }

  async getPrice(productId: Product['id']): Promise<number> {
    const price = await this.productRepository.getPriceById(productId);
    if (!price) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return price;
  }

  async searchProduct(
    page: number,
    name?: string,
    categoryIds?: string,
  ): Promise<ProductInfoDTO[]> {
    let findOption = '';
    if (categoryIds) {
      const ids = `('${categoryIds.split(',').join("','")}')`;
      if (name) {
        findOption = `where lower(p.name) like '%${name.toLocaleLowerCase()}%' 
            and cp.category_id in ${ids} 
            and p.delete_at is null`;
      }
      findOption = `where cp.category_id in ${ids} and p.delete_at is null`;
    }
    if (name) {
      findOption = `where p.name like '%${name}%' and p.delete_at is null`;
    }
    return this.productRepository.getProductPaginate(findOption, page);
  }

  async createProduct(createProductDto: CreateProductDTO): Promise<void> {
    const {
      name,
      base_price,
      discount_percentage,
      stock,
      description,
      img_url,
    } = createProductDto;
    const newProduct = this.productRepository.create({
      name,
      base_price,
      discount_percentage,
      stock,
      description,
      img_url: this.formatUrlName(img_url),
    });
    try {
      await newProduct.save();
      for (const categoryId of createProductDto.category_id) {
        await this.categoryProductService.create(newProduct.id, categoryId);
      }
    } catch (e) {
      console.log(e);
      throw new HttpException('message', 400, { cause: new Error(e) });
    }
  }

  async deleteProduct(id: Product['id']): Promise<void> {
    await this.productRepository.softDelete(id);
    await this.categoryProductService.softDelete(id);
  }

  async restore(id: Product['id']): Promise<void> {
    await this.productRepository.restore(id);
  }

  async getAll(): Promise<Product[]> {
    const product = await this.productRepository.find();
    return product;
  }

  async newReviewAdd(id: Product['id'], point): Promise<void> {
    await this.productRepository.updateNewReview(id, point);
  }

  async update(
    productId: Product['id'],
    updateProductDTO: UpdateProductDTO,
  ): Promise<void> {
    const { category_id, ...updateProduct } = updateProductDTO;
    if (category_id) {
      await Promise.all(
        category_id.map(async (id) => {
          await this.categoryProductService.softDelete(productId);
          await this.categoryProductService.create(productId, id);
        }),
      );
    }
    await this.productRepository.update(productId, updateProduct);
  }
}

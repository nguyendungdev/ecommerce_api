import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { CreateProductDTO } from './dto/create-product.dto';
import { CategoryProductRepository } from './category-product.repository';
import { ProductInfoDTO } from './dto/product-info.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductService {
   constructor(
      private readonly productRepository: ProductRepository,
      private readonly categoryProductRepository: CategoryProductRepository,
   ) {}

   /**
    * Format a product name into a URL-friendly format.
    *
    * @param name string - url
    * @returns string - Formatted name.
    */
   private formatUrlName(name: string) {
      const lowerCaseName = name.toLocaleLowerCase();
      const trimmedName = lowerCaseName.trim();
      const singleSpaceName = trimmedName.replace(/\s\s+/g, ' ');
      const spaceToHyphenName = singleSpaceName.split(' ').join('-');
      return spaceToHyphenName;
   }

   /**
    * Get the price of a product.
    *
    * @param productId string - ID of the product.
    * @returns Promise<number> - Final price of the product.
    * @throws NotFoundException - If the product is not found.
    */
   async getPrice(productId: Product['id']): Promise<number> {
      const price = await this.productRepository.getPriceById(productId);
      if (!price) {
         throw new NotFoundException(`Product with ID ${productId} not found`);
      }
      return price;
   }

   /**
    * Find products by name and/or category IDs with pagination.
    *
    * @param page number - Page number for pagination.
    * @param name string (optional) - The name of the product to search for.
    * @param categoryIds string (optional) - A comma-separated list of category IDs to filter by.
    * @returns Promise<ProductInfoDTO[]> - Array of Product's
    *  Info  matching the filter criteria.
    */
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
      return await this.productRepository.getProductPaginate(findOption, page);
   }

   /**
    * Create a new product.
    *
    * @param createProductDto CreateProductDTO - Data for creating a new product.
    */
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
            await this.categoryProductRepository.save(
               await this.categoryProductRepository.create({
                  product_id: newProduct.id,
                  category_id: categoryId,
               }),
            );
         }
      } catch (e) {
         console.log(e);
         throw new HttpException('message', 400, { cause: new Error(e) });
      }
   }

   /**
    * Delete a product by its ID.
    *
    * @param id string - ID of the product to delete.
    */
   async deleteProduct(id: Product['id']): Promise<void> {
      const result = await this.productRepository.softDelete(id);
      if (result.affected === 0) {
         throw new NotFoundException(`Product with ID ${id} not found`);
      }
   }

   /**
    * Restore a soft-deleted product by its ID.
    *
    * @param id string - ID of the product to restore.
    */
   async restore(id: Product['id']): Promise<void> {
      await this.productRepository.restore(id);
   }

   /**
    * Get all products.
    *
    * @returns Promise<Product[]> - Array of all products.
    */
   async getAll(): Promise<Product[]> {
      const product = await this.productRepository.find();
      return product;
   }

   async newReviewAdd(id: Product['id'], point): Promise<void> {
      await this.productRepository.updateNewReview(id, point);
   }

   async update(
      id: Product['id'],
      updateProductDTO: UpdateProductDTO,
   ): Promise<void> {
      await this.productRepository.update(id, updateProductDTO);
   }
}

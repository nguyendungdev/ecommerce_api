import {
   DefaultValuePipe,
   Injectable,
   Query,
   InternalServerErrorException,
   HttpException,
   NotFoundException,
} from '@nestjs/common';
import { FilterProductDTO } from './dto/filter-product.dto';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { CreateProductDTO } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
   constructor(
      @InjectRepository(Product)
      private readonly productRepository: ProductRepository,
   ) {}

   /**
    * Format a product name into a URL-friendly format.
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
    * @param productId string - ID of the product.
    * @returns Promise<number> - Final price of the product.
    * @throws NotFoundException - If the product is not found.
    */
   async getPrice(productId: string): Promise<number> {
      const product = await this.productRepository.findOne({
         select: {
            basePrice: true,
            discountPercentage: true,
         },
         where: {
            id: productId,
         },
      });
      if (!product) {
         throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      if (product) {
         const finalPrice =
            product.basePrice - product.discountPercentage * product.basePrice;
         return finalPrice;
      }
   }

   /**
    * Find all products by name with pagination.
    * @param findProductDto FilterProductDTO - Filter options for finding products.
    * @param page number - Page number for pagination.
    * @returns Promise<Product[]> - Array of Product objects matching the filter criteria.
    */
   async findAllByName(
      findProductDto: FilterProductDTO,
      page: number,
   ): Promise<Product[]> {
      const offset = 10;
      const productSkip = (page - 1) * offset;

      return this.productRepository.find({
         where: {
            name: findProductDto.name,
         },
         skip: productSkip,
         take: offset,
      });
   }

   /**
    * Create a new product.
    * @param createProductDto CreateProductDTO - Data for creating a new product.
    */
   async createProduct(createProductDto: CreateProductDTO): Promise<void> {
      const {
         name,
         basePrice,
         discountPercentage,
         stock,
         description,
         categoryId,
         imgUrl,
      } = createProductDto;
      const newProduct = this.productRepository.create();
      newProduct.name = name;
      newProduct.basePrice = basePrice;
      newProduct.discountPercentage = discountPercentage;
      newProduct.stock = stock;
      newProduct.description = description;
      newProduct.categoryId = categoryId;
      newProduct.imgUrl = this.formatUrlName(imgUrl);
      try {
         await newProduct.save();
      } catch (e) {
         console.log(e);
         throw new HttpException('message', 400, { cause: new Error(e) });
      }
   }

   /**
    * Delete a product by its ID.
    * @param id string - ID of the product to delete.
    */
   async deleteProduct(id: string): Promise<void> {
      const result = await this.productRepository.softDelete(id);
      if (result.affected === 0) {
         throw new NotFoundException(`Product with ID ${id} not found`);
      }
   }

   /**
    * Restore a soft-deleted product by its ID.
    * @param id string - ID of the product to restore.
    */
   async restore(id: string): Promise<void> {
      await this.productRepository.restore(id);
   }
   /**
    * Get all products.
    * @returns Promise<Product[]> - Array of all products.
    */
   async getAll(): Promise<Product[]> {
      const product = await this.productRepository.find();
      return product;
   }
}

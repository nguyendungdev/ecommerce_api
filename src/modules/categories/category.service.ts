import {
   Injectable,
   ConflictException,
   InternalServerErrorException,
   NotFoundException,
} from '@nestjs/common';
import { Category } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategorysRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CommonMessage } from '../../common/constants/messages.constants';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
   constructor(
      @InjectRepository(Category)
      private readonly categoryRepository: CategorysRepository,
   ) { }
   /**
    * Get all categories with their associated products.
    * @returns Promise<Category[]> - Array of categories with products.
    * @throws NotFoundException - If no categories are found.
    */
   async getAll() {
      const category = await this.categoryRepository
         .createQueryBuilder('category')
         .addSelect('category')
         .addSelect('product')
         .innerJoin('category.products', 'product')
         .getMany();
      if (!category) {
         throw new NotFoundException(CommonMessage.NOT_FOUND_BY_ID);
      }
      return category;
   }

   /**
    * Get a category by its name.
    * @param name string - Name of the category.
    * @returns Promise<Category | null> - The found category or null if not found.
    */
   async getByName(name: string): Promise<Category | null> {
      const category = await this.categoryRepository.findOneBy({ name });

      return category || null;
   }

   /**
    * Delete a category (soft delete) by its ID.
    * @param id string - ID of the category.
    * @throws NotFoundException - If the category is not found.
    */
   async delete(id: string): Promise<void> {
      const result = await this.categoryRepository.softDelete(id);

      if (result.affected === 0) {
         throw new NotFoundException(CommonMessage.NOT_FOUND_BY_ID);
      }
   }

   /**
    * Restore a soft-deleted category by its ID.
    * @param id string - ID of the category.
    */
   async restore(id: string): Promise<void> {
      await this.categoryRepository.restore(id);
   }

   /**
    * Update a category by its ID with the provided data.
    * @param id string - ID of the category to update.
    * @param updateCategoryDto UpdateCategoryDto - Data to update the category.
    */
   async update(
      id: string,
      updateCategoryDto: UpdateCategoryDto,
   ): Promise<void> {
      await this.categoryRepository.update(id, updateCategoryDto);
   }

   /**
    * Create a new category with the provided data.
    * @param createCategoryDto CreateCategoryDto - Data to create a new category.
    * @throws ConflictException - If a category with the same name already exists.
    * @throws InternalServerErrorException - If there's an internal server error during creation.
    */
   async create(createCategoryDto: CreateCategoryDto): Promise<void> {
      const { name, description } = createCategoryDto;
      if (!this.getByName(name)) {
         throw new ConflictException(`Category ${CommonMessage.ALREADY_EXIST}`);
      }
      const newCategory = this.categoryRepository.create();
      newCategory.name = name;
      newCategory.description = description;

      try {
         await newCategory.save();
      } catch (error) {
         if (error.code === '23505') {
            // Duplicate.
            throw new ConflictException(
               `Category ${CommonMessage.ALREADY_EXIST}`,
            );
         }
         throw new InternalServerErrorException(error);
      }
   }
}

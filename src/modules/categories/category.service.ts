import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommonMessage } from '@common/constants/messages.constants';
import { NullableType } from '@common/types/nullable.type';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesMessage } from './category.constants';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) { }

  async getAll(page: number): Promise<NullableType<Category[]>> {
    const category = await this.categoryRepository.getAll(page);
    if (!category) {
      throw new NotFoundException(CommonMessage.NOT_FOUND_BY_ID);
    }
    return category;
  }

  async getByName(name: string): Promise<NullableType<Category>> {
    const category = await this.categoryRepository.getByName(name);
    if (!category[0]) {
      return null;
    }
    return category[0];
  }

  async delete(id: Category['id']): Promise<void> {
    await this.categoryRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.categoryRepository.restore(id);
  }

  async update(
    id: Category['id'],
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    await this.categoryRepository.update(id, updateCategoryDto);
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<void> {
    const { name, description } = createCategoryDto;
    const newCategory = await this.categoryRepository.create(createCategoryDto);
    newCategory.name = name;
    newCategory.description = description;
    try {
      await newCategory.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(CategoriesMessage.ALREADY_EXIST);
      }
      throw new InternalServerErrorException(error);
    }
  }
}

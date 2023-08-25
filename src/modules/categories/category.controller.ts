import {
   Get,
   Put,
   Body,
   Controller,
   Param,
   UseGuards,
   HttpCode,
   HttpStatus,
   Post,
   Delete,
   NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
   ApiBadRequestResponse,
   ApiBearerAuth,
   ApiBody,
   ApiInternalServerErrorResponse,
   ApiOkResponse,
   ApiOperation,
   ApiParam,
   ApiTags,
   ApiUnauthorizedResponse,
   ApiCreatedResponse,
   ApiConflictResponse,
} from '@nestjs/swagger';
import { CommonDescription } from 'src/common/constants/descriptions.constants';
import { ErrorResponse } from '../../common/dto/response.dto';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CommonSummary } from 'src/common/constants/summary.constants';

@ApiTags('Category')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('Category')
export class CategoryController {
   constructor(private readonly categoryService: CategoryService) { }

   @Get('')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: `${CommonSummary.GET_ALL_ITEM} category ` })
   @ApiOkResponse({
      description: CommonDescription.GET_ITEM_SUCCESS,
      type: Category,
   })
   @ApiBadRequestResponse({
      description: CommonDescription.BAD_REQUEST,
      type: ErrorResponse,
   })
   @ApiUnauthorizedResponse({
      description: CommonDescription.UNAUTHORIZED,
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: CommonDescription.INTERNAL_SERVER_ERROR,
      type: ErrorResponse,
   })
   async getAll() {
      return this.categoryService.getAll();
   }

   @Post('/add-new')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: `${CommonSummary.CREATE_NEW_ITEM} category` })
   @ApiBody({ type: CreateCategoryDto })
   @ApiCreatedResponse({
      description: 'New category created successfully',
      type: CreateCategoryDto,
   })
   @ApiConflictResponse({
      description: 'Category already exists',
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: CommonDescription.INTERNAL_SERVER_ERROR,
      type: ErrorResponse,
   })
   async addNew(@Body() createCategoryDto: CreateCategoryDto): Promise<void> {
      return this.categoryService.create(createCategoryDto);
   }

   @Delete('/delete/:id')
   @HttpCode(HttpStatus.OK)
   @ApiParam({ name: 'id', type: 'string' })
   @ApiOperation({ summary: `${CommonSummary.DELETE_ITEM} category by ID` })
   @ApiOkResponse({
      description: 'Category deleted successfully',
   })
   @ApiInternalServerErrorResponse({
      description: CommonDescription.INTERNAL_SERVER_ERROR,
      type: ErrorResponse,
   })
   async delete(@Param() id: string) {
      try {
         await this.categoryService.delete(id);
      } catch (e) {
         throw new NotFoundException(e);
      }
   }

   @Put('/update/:id')
   @ApiOperation({ summary: 'Update category by ID' })
   @ApiParam({ name: 'id', type: 'string' })
   @ApiBody({ type: UpdateCategoryDto })
   @ApiOkResponse({
      description: 'Category updated successfully',
   })
   @ApiBadRequestResponse({
      description: CommonDescription.BAD_REQUEST,
      type: ErrorResponse,
   })
   @ApiUnauthorizedResponse({
      description: CommonDescription.UNAUTHORIZED,
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: CommonDescription.INTERNAL_SERVER_ERROR,
      type: ErrorResponse,
   })
   async update(
      @Param() id: string,
      @Body() updateCategoryDto: UpdateCategoryDto,
   ): Promise<void> {
      try {
         await this.categoryService.update(id, updateCategoryDto);
      } catch (e) {
         throw new NotFoundException(e);
      }
   }
}

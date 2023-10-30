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
} from '@nestjs/swagger';
import { CommonDescription } from 'src/common/constants/descriptions.constants';
import { ErrorResponse } from '../../common/dto/response.dto';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesSummary } from './category.constants';

@ApiTags('Category')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('Category')
export class CategoryController {
   constructor(private readonly categoryService: CategoryService) {}

   // @Get('')
   // @HttpCode(HttpStatus.OK)
   // @ApiOperation({ summary: CategoriesSummary.GET_ALL })
   // @ApiOkResponse({
   //    description: CommonDescription.GET_ITEM_SUCCESS,
   //    type: Category,
   // })
   // @ApiBadRequestResponse({
   //    description: CommonDescription.BAD_REQUEST,
   //    type: ErrorResponse,
   // })
   // @ApiUnauthorizedResponse({
   //    description: CommonDescription.UNAUTHORIZED,
   //    type: ErrorResponse,
   // })
   // @ApiInternalServerErrorResponse({
   //    description: CommonDescription.INTERNAL_SERVER_ERROR,
   //    type: ErrorResponse,
   // })
   // async getAll() {
   //    return this.categoryService.getAll();
   // }

   // @Post('')
   // @HttpCode(HttpStatus.OK)
   // @ApiOperation({ summary: CategoriesSummary.CREATE_NEW })
   // @ApiBody({ type: CreateCategoryDto })
   // @ApiCreatedResponse({
   //    description: CommonDescription.CREATE_ITEM_SUCCESS,
   //    type: CreateCategoryDto,
   // })
   // @ApiBadRequestResponse({
   //    description: CommonDescription.BAD_REQUEST,
   //    type: ErrorResponse,
   // })
   // @ApiUnauthorizedResponse({
   //    description: CommonDescription.UNAUTHORIZED,
   //    type: ErrorResponse,
   // })
   // @ApiInternalServerErrorResponse({
   //    description: CommonDescription.INTERNAL_SERVER_ERROR,
   //    type: ErrorResponse,
   // })
   // async addNew(@Body() createCategoryDto: CreateCategoryDto): Promise<void> {
   //    return this.categoryService.create(createCategoryDto);
   // }

   // @Delete('/:id')
   // @HttpCode(HttpStatus.OK)
   // @ApiParam({ name: 'id', type: 'string' })
   // @ApiOperation({ summary: CategoriesSummary.DELETE_BY_ID })
   // @ApiBadRequestResponse({
   //    description: CommonDescription.BAD_REQUEST,
   //    type: ErrorResponse,
   // })
   // @ApiUnauthorizedResponse({
   //    description: CommonDescription.UNAUTHORIZED,
   //    type: ErrorResponse,
   // })
   // @ApiInternalServerErrorResponse({
   //    description: CommonDescription.INTERNAL_SERVER_ERROR,
   //    type: ErrorResponse,
   // })
   // async delete(@Param() id: string) {
   //    await this.categoryService.delete(id);
   // }

   // @Put('/:id')
   // @ApiOperation({ summary: CategoriesSummary.UPDATE_BY_ID })
   // @ApiParam({ name: 'id', type: 'string' })
   // @ApiBody({ type: UpdateCategoryDto })
   // @ApiOkResponse({
   //    description: CommonDescription.UPDATE_ITEM_SUCESS,
   // })
   // @ApiBadRequestResponse({
   //    description: CommonDescription.BAD_REQUEST,
   //    type: ErrorResponse,
   // })
   // @ApiUnauthorizedResponse({
   //    description: CommonDescription.UNAUTHORIZED,
   //    type: ErrorResponse,
   // })
   // @ApiInternalServerErrorResponse({
   //    description: CommonDescription.INTERNAL_SERVER_ERROR,
   //    type: ErrorResponse,
   // })
   // async update(
   //    @Param() id: string,
   //    @Body() updateCategoryDto: UpdateCategoryDto,
   // ): Promise<void> {
   //    try {
   //       await this.categoryService.update(id, updateCategoryDto);
   //    } catch (e) {
   //       throw new NotFoundException(e);
   //    }
   // }
}

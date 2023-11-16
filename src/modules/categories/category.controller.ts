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
  Query,
  ParseIntPipe,
  DefaultValuePipe,
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
import { CommonDescription } from '@common/constants/descriptions.constants';
import { ErrorResponse } from '@common/dto/response.dto';
import { RolesGuard } from '@users/guards/roles.guard';
import { Roles } from '@common/decorators/role.decorators';
import { Role } from '@users/roles.enum';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesSummary } from './category.constants';

@ApiTags('Category')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: CategoriesSummary.GET_ALL })
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
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.categoryService.getAll(page);
  }

  @Post('')
  @Roles(Role.Seller)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: CategoriesSummary.CREATE_NEW })
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({
    description: CommonDescription.CREATE_ITEM_SUCCESS,
    type: CreateCategoryDto,
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
  async addNew(@Body() createCategoryDto: CreateCategoryDto): Promise<void> {
    return this.categoryService.create(createCategoryDto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({ summary: CategoriesSummary.DELETE_BY_ID })
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
  async delete(@Param() id: string) {
    return this.categoryService.delete(id);
  }

  @Put('/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: CategoriesSummary.UPDATE_BY_ID })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({
    description: CommonDescription.UPDATE_ITEM_SUCESS,
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
    return this.categoryService.update(id, updateCategoryDto);
  }
}

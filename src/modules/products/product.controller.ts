import {
   Controller,
   Get,
   Post,
   Body,
   Param,
   Delete,
   Patch,
   UseGuards,
   Query,
   ParseIntPipe,
   DefaultValuePipe,
} from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product.dto';
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
   ApiQuery,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../common/dto/response.dto';
import { AuthGuard } from '@nestjs/passport';
import { ProductInfoDTO } from './dto/product-info.dto';
import { ProductsSummary } from './product.constants';
import { CommonDescription } from '../../common/constants/descriptions.constants';

@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('Product')
export class ProductController {
   constructor(private readonly productService: ProductService) {}

   @Get('')
   @ApiOperation({ summary: ProductsSummary.GET_ALL })
   @ApiOkResponse({
      description: CommonDescription.GET_ITEM_SUCCESS,
      type: Product,
      isArray: true,
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
   async getAllProducts(): Promise<Product[]> {
      const products = await this.productService.getAll();
      return products;
   }

   @Get('/search/')
   @ApiQuery({ name: 'category_id', required: false })
   @ApiQuery({ name: 'name', required: false })
   @ApiOperation({ summary: ProductsSummary.SEARCH_FOR_PRODUCT })
   @ApiOkResponse({
      description: CommonDescription.GET_ITEM_SUCCESS,
      type: ProductInfoDTO,
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
   async search(
      @Query('name') name: string,
      @Query('category_id') categoryId: string,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
   ): Promise<ProductInfoDTO[]> {
      return await this.productService.searchProduct(page, name, categoryId);
   }

   @Post('/')
   @ApiOperation({ summary: ProductsSummary.CREATE_NEW })
   @ApiBody({ type: CreateProductDTO })
   @ApiCreatedResponse({
      description: CommonDescription.CREATE_ITEM_SUCCESS,
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
   async createProduct(
      @Body() createProductDto: CreateProductDTO,
   ): Promise<void> {
      await this.productService.createProduct(createProductDto);
   }

   @Delete('/:id')
   @ApiOperation({ summary: ProductsSummary.DELETE_BY_ID })
   @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
   @ApiOkResponse({
      description: CommonDescription.DELETE_ITEM_SUCCESS,
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
   async deleteProductById(@Param('id') id: string): Promise<void> {
      await this.productService.deleteProduct(id);
   }

   @Patch('/:id/restore/')
   @ApiOperation({ summary: ProductsSummary.RESTORE_BY_ID })
   @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
   @ApiOkResponse({
      description: CommonDescription.RESTORE_ITEM_SUCCESS,
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
   async restoreProductById(@Param('id') id: string): Promise<void> {
      await this.productService.restore(id);
   }
}

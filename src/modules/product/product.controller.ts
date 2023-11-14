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
   ApiConflictResponse,
   ApiNoContentResponse,
   ApiQuery,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../common/dto/response.dto';
import { AuthGuard } from '@nestjs/passport';
import { ProductInfoDTO } from './dto/product-info.dto';

@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('Product')
export class ProductController {
   constructor(private readonly productService: ProductService) {}

   @Get('')
   @ApiOperation({ summary: 'Get all products' })
   @ApiOkResponse({
      description: 'Successfully retrieved all products',
      type: Product,
      isArray: true,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async getAllProducts(): Promise<Product[]> {
      const products = await this.productService.getAll();
      return products;
   }

   @Get('/search/')
   @ApiOperation({ summary: 'search for products' })
   @ApiQuery({ name: 'category_id', required: false })
   @ApiQuery({ name: 'name', required: false })
   @ApiOkResponse({
      description: 'Successfully retrieved all products',
      type: ProductInfoDTO,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
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
   @ApiOperation({ summary: 'Create a new product' })
   @ApiBody({ type: CreateProductDTO })
   @ApiCreatedResponse({
      description: 'Product created successfully',
   })
   @ApiBadRequestResponse({
      description: 'Invalid request',
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async createProduct(
      @Body() createProductDto: CreateProductDTO,
   ): Promise<void> {
      await this.productService.createProduct(createProductDto);
   }

   @Delete('/:id')
   @ApiOperation({ summary: 'Delete product by ID' })
   @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
   @ApiNoContentResponse({
      description: 'Product deleted successfully',
   })
   @ApiBadRequestResponse({
      description: 'Invalid request',
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async deleteProductById(@Param('id') id: string): Promise<void> {
      await this.productService.deleteProduct(id);
   }

   @Patch('/:id/restore/')
   @ApiOperation({ summary: 'Restore product by ID' })
   @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
   @ApiNoContentResponse({
      description: 'Product restored successfully',
   })
   @ApiBadRequestResponse({
      description: 'Invalid request',
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async restoreProductById(@Param('id') id: string): Promise<void> {
      await this.productService.restore(id);
   }
}

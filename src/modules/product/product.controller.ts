import {
   Controller,
   Get,
   Post,
   Body,
   Param,
   Delete,
   Patch,
   UseGuards,
} from '@nestjs/common';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { FilterProductDTO } from './dto/filter-product.dto';
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
} from '@nestjs/swagger';
import { ErrorResponse } from '../../common/dto/response.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('Product')
export class ProductController {
   constructor(private readonly productService: ProductService) { }

   @Get('/all')
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

   @Post('/new')
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

   @Delete('/delete/:id')
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

   @Patch('/restore/:id')
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

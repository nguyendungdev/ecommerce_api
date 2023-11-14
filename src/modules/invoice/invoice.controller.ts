import {
   Controller,
   Post,
   Body,
   Param,
   UseGuards,
   HttpCode,
   HttpStatus,
   Get,
   Put,
   NotFoundException,
} from '@nestjs/common';
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
import { ErrorResponse } from '../../common/dto/response.dto';
import { InvoiceService } from './invoice.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './invoice.entity';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { CommonDescription } from 'src/common/constants/descriptions.constants';

@Controller('invoice')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('invoice')
export class InvoiceController {
   constructor(private readonly invoiceService: InvoiceService) {}

   @Get('/:id')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get all invoices' })
   @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
   @ApiOkResponse({
      description: 'Successfully retrieved invoices',
      type: Invoice,
      isArray: true,
   })
   @ApiBadRequestResponse({
      description: 'Invalid request',
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async getAll(@Param('id') id: string): Promise<Invoice[]> {
      return this.invoiceService.getAllInvoice(id);
   }

   @Post('create')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Create new invoice' })
   @ApiBody({ type: CreateInvoiceDto })
   @ApiCreatedResponse({
      description: 'Invoice created successfully',
      type: Invoice,
   })
   @ApiBadRequestResponse({
      description: 'Invalid request',
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<void> {
      this.invoiceService.createInvoice(createInvoiceDto);
   }

   @Put('/update/:id')
   @ApiOperation({ summary: 'Update category by ID' })
   @ApiParam({ name: 'id', type: 'string' })
   @ApiBody({ type: UpdateInvoiceDto })
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
      @Body() updateInvoiceDto: UpdateInvoiceDto,
   ): Promise<void> {
      try {
         await this.invoiceService.update(id, updateInvoiceDto);
      } catch (e) {
         throw new NotFoundException(e);
      }
   }
}

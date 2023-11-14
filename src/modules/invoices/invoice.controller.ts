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
  Query,
  Delete,
  Request
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
import { ErrorResponse } from '@common/dto/response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@users/guards/roles.guard';
import { Roles } from '@common/decorators/role.decorators';
import { Role } from '@users/roles.enum';
import { CommonDescription } from '@common/constants/descriptions.constants';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesSummary } from './invoice.constants';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: InvoicesSummary.GET_ALL })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiOkResponse({
    description: CommonDescription.GET_ITEM_SUCCESS,
    type: Invoice,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: CommonDescription.BAD_REQUEST,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  async getAll(@Request() req, @Query('id') id: string): Promise<Invoice[]> {
    return this.invoiceService.getAllInvoice(id);
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: InvoicesSummary.CREATE_NEW })
  @ApiBody({ type: CreateInvoiceDto })
  @ApiCreatedResponse({
    description: InvoicesSummary.CREATE_NEW,
    type: Invoice,
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
  async create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<void> {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Put('/:id')
  @ApiOperation({ summary: InvoicesSummary.UPDATE_BY_ID })
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
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({ summary: InvoicesSummary.DELETE_BY_ID })
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
    return this.invoiceService.delete(id);
  }
}

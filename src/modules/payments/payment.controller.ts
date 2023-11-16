import {
  Get,
  Body,
  Controller,
  Param,
  UseGuards,
  Post,
  Delete,
  Patch,
  Request,
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
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '@common/dto/response.dto';
import { CommonDescription } from '@common/constants/descriptions.constants';
import { AuthGuard } from '@nestjs/passport';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentsSummary } from './payment.constants';

@ApiTags('Payment')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Get('/:id')
  @ApiOkResponse({
    description: CommonDescription.GET_ITEM_SUCCESS,
    type: Payment,
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
  async getAllById(@Request() req): Promise<Payment[]> {
    return this.paymentService.findPayments(req.user.session_id);
  }

  @Post('')
  @ApiOperation({
    summary: PaymentsSummary.CREATE_NEW,
  })
  @ApiBody({ type: CreatePaymentDto })
  @ApiCreatedResponse({
    description: CommonDescription.CREATE_ITEM_SUCCESS,
    type: Payment,
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
  async addNewPayment(
    @Request() req,
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<void> {
    return this.paymentService.addPayment(
      req.user.session_id,
      createPaymentDto,
    );
  }

  @Delete('')
  @ApiOperation({ summary: PaymentsSummary.DELETE_BY_ID })
  @ApiParam({ name: 'id', type: 'string' })
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
  async deletePayment(@Param('id') id: string): Promise<void> {
    return this.paymentService.deletePayment(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: PaymentsSummary.UPDATE_BY_ID })
  @ApiParam({ name: 'id', type: 'string', description: 'Payment ID' })
  @ApiBody({ type: UpdatePaymentDto })
  @ApiNoContentResponse({
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
  async updatePayment(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<void> {
    return this.paymentService.updatePayments(id, updatePaymentDto);
  }
}

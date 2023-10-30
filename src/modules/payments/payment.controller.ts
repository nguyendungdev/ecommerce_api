import {
   Get,
   Body,
   Controller,
   Param,
   UseGuards,
   Post,
   Delete,
   Patch,
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
import { ErrorResponse } from '../../common/dto/response.dto';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { DeletePaymentDto } from './dto/delete-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsSummary } from './payment.constants';
import { CommonDescription } from '../../common/constants/descriptions.constants';

@ApiTags('Payment')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('Payment')
@Controller('payment')
export class PaymentController {
   constructor(private readonly paymentService: PaymentService) {}

   @Get('/:id')
   @ApiOperation({ summary: PaymentsSummary.GET_BY_USER_ID })
   @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
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
   async getAllById(@Param('id') id: string): Promise<Payment[]> {
      const payments = this.paymentService.findPayments(id);
      return payments;
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
      @Body() createPaymentDto: CreatePaymentDto,
   ): Promise<void> {
      this.paymentService.addPayment(createPaymentDto);
   }

   @Delete('')
   @ApiOperation({ summary: PaymentsSummary.DELETE_BY_ID })
   @ApiBody({ type: DeletePaymentDto })
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
   async deletePayment(
      @Body() deletePaymentDto: DeletePaymentDto,
   ): Promise<void> {
      this.paymentService.deletePayment(deletePaymentDto);
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
      await this.paymentService.updatePayments(id, updatePaymentDto);
   }
}

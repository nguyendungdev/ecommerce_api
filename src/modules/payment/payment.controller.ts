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
   Patch,
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
   ApiNoContentResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../common/dto/response.dto';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { DeletePaymentDto } from './dto/delete-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Payment')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('Payment')
@Controller('payment')
export class PaymentController {
   constructor(private readonly paymentService: PaymentService) {}

   @Get('/:id')
   @ApiOperation({ summary: 'Get all payments by ID' })
   @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
   @ApiOkResponse({
      description: 'Successfully retrieved payments',
      type: Payment,
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
   async getAllById(@Param('id') id: string): Promise<Payment[]> {
      const payments = this.paymentService.findPayments(id);
      return payments;
   }

   @Post('')
   @ApiOperation({ summary: 'Add new payment' })
   @ApiBody({ type: CreatePaymentDto })
   @ApiCreatedResponse({
      description: 'Payment added successfully',
      type: Payment,
   })
   @ApiBadRequestResponse({
      description: 'Invalid request',
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async addNewPayment(
      @Body() createPaymentDto: CreatePaymentDto,
   ): Promise<void> {
      this.paymentService.addPayment(createPaymentDto);
   }

   @Delete('')
   @ApiOperation({ summary: 'Delete payment' })
   @ApiBody({ type: DeletePaymentDto })
   @ApiNoContentResponse({
      description: 'Payment deleted successfully',
   })
   @ApiBadRequestResponse({
      description: 'Invalid request',
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async deletePayment(
      @Body() deletePaymentDto: DeletePaymentDto,
   ): Promise<void> {
      this.paymentService.deletePayment(deletePaymentDto);
   }

   @Patch('/:id')
   @ApiOperation({ summary: 'Update payment' })
   @ApiParam({ name: 'id', type: 'string', description: 'Payment ID' })
   @ApiBody({ type: UpdatePaymentDto })
   @ApiNoContentResponse({
      description: 'Payment updated successfully',
   })
   @ApiBadRequestResponse({
      description: 'Invalid request',
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async updatePayment(
      @Param('id') id: string,
      @Body() updatePaymentDto: UpdatePaymentDto,
   ): Promise<void> {
      await this.paymentService.updatePayments(id, updatePaymentDto);
   }
}

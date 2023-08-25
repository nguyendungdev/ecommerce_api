import { PaymentMethod } from '../payment-method.enum';
import { IsIn, IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePaymentDto {
   @ApiProperty({
      enum: PaymentMethod,
      example: PaymentMethod.VISA,
      description: 'The payment method',
   })
   @IsIn([
      PaymentMethod.VISA,
      PaymentMethod.PAYPAL,
      PaymentMethod.CASH_ON_DELIVERY,
      PaymentMethod.MASTERCARD,
      PaymentMethod.PURCHASE_ORDER,
   ])
   @IsOptional()
   paymentMethod: PaymentMethod;

   @ApiProperty({
      example: '86c504ac-9d66-475d-bc14-7bafa79e6737',
      description: 'The ID of the user',
   })
   @IsString()
   userId: string;

   @ApiProperty({
      example: '2023-12-31T23:59:59Z',
      description: 'The expiry date of the payment',
   })
   @IsDate()
   @IsOptional()
   expiry: Date;

   @ApiProperty({
      example: 'PayPal',
      description: 'The payment provider',
   })
   @IsOptional()
   prodiver: string;

   @ApiProperty({
      example: 1234567890,
      description: 'The account number',
   })
   @IsNumber()
   @IsOptional()
   acountNo: number;
}

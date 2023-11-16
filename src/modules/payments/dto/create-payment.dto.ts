import { IsIn, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../payment-method.enum';

export class CreatePaymentDto {
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
  payment_method: PaymentMethod;

  @ApiProperty({
    example: '2023-12-31',
    description: 'The expiry date of the payment',
  })
  @IsDate()
  expiry: Date;

  @ApiProperty({
    example: 'PayPal',
    description: 'The payment provider',
  })
  prodiver: string;

  @ApiProperty({
    example: 1234567890,
    description: 'The account number',
  })
  @IsNumber()
  acount_no: number;
}

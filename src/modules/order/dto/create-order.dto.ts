import { OrderStatus } from '../order-status.enum';
import {
   IsNumber,
   IsNotEmpty,
   IsString,
   IsDate,
   IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
   @IsNumber()
   @IsNotEmpty()
   @ApiProperty({ description: 'Quantity of the item', example: 2 })
   quanity: number;

   @IsNumber()
   @IsNotEmpty()
   @ApiProperty({ description: 'Total price of the item', example: 1 })
   total_price: number;

   @IsString()
   @IsNotEmpty()
   @ApiProperty({
      description: 'ID of the product',
      example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
   })
   product_id: string;
}

export class CreateOrderDto {
   @IsNotEmpty()
   @IsDate()
   @ApiProperty({ description: 'Order date', example: '2023-07-27' })
   order_date: Date;

   @IsNotEmpty()
   @IsString()
   @ApiProperty({ description: 'Order status', example: 'Pending' })
   status: OrderStatus;

   @IsNotEmpty()
   @IsString()
   @ApiProperty({ description: 'Shipment date', example: '2023-07-29' })
   shipment_date: string;

   @IsString()
   @IsOptional()
   @ApiProperty({
      description: 'Order comment',
      example: 'Please deliver to the front door.',
   })
   comment: string;

   @IsNotEmpty()
   @IsString()
   @ApiProperty({
      description: 'Shipping address',
      example: '1234 Main Street',
   })
   shipped_to: string;

   @IsNotEmpty()
   @IsString()
   @ApiProperty({ description: 'User ID', example: '1234567890' })
   user_id: string;

   @ApiProperty({
      description: 'Array of cart items',
      example: [
         {
            quantity: 2,
            totalPrice: 1,
            productId: '574c3d35-0e6f-4141-8e90-f018a803fd59',
         },
         {
            quantity: 3,
            totalPrice: 2,
            productId: '9876543210',
         },
      ],
      type: [OrderItemDto],
   })
   @Type(() => OrderItemDto)
   order_items: OrderItemDto[];
}

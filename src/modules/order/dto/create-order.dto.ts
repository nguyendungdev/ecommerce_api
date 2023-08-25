import { OrderStatus } from '../order-status.enum';
import {
   IsNumber,
   IsNotEmpty,
   IsUUID,
   ValidateNested,
   IsString,
   IsDate,
   IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../product/product.entity';

export class OrderItemDto {
   @IsNumber()
   @IsNotEmpty()
   @ApiProperty({ description: 'Quantity of the item', example: 2 })
   quantity: number;

   @IsNumber()
   @IsNotEmpty()
   @ApiProperty({ description: 'Total price of the item', example: 1 })
   totalPrice: number;

   @IsString()
   @IsNotEmpty()
   @ApiProperty({
      description: 'ID of the product',
      example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
   })
   productId: string;
}

export class CreateOrderDto {
   @IsNotEmpty()
   @IsDate()
   @ApiProperty({ description: 'Order date', example: '2023-07-27' })
   orderDate: Date;

   @IsNotEmpty()
   @IsString()
   @ApiProperty({ description: 'Order status', example: 'Pending' })
   status: OrderStatus;

   @IsNotEmpty()
   @IsString()
   @ApiProperty({ description: 'Shipment date', example: '2023-07-29' })
   shipmentDate: string;

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
   shippedTo: string;

   @IsNotEmpty()
   @IsString()
   @ApiProperty({ description: 'User ID', example: '1234567890' })
   userId: string;

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
   orderItems: OrderItemDto[];
}

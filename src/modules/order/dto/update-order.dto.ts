import { OrderStatus } from '../order-status.enum';
import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemUpdateDto {
   @IsNumber()
   @IsOptional()
   @ApiProperty({ description: 'Quantity of the item', example: 2 })
   quantity: number;

   @IsNumber()
   @IsOptional()
   @ApiProperty({ description: 'Total price of the item', example: 1 })
   totalPrice: number;

   @IsString()
   @ApiProperty({
      description: 'ID of the order item',
      example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
   })
   orderItemId: string;
}

export class UpdateOrderDto {
   @IsOptional()
   @IsDate()
   @ApiProperty({ description: 'Order date', example: '2023-07-27' })
   orderDate: Date;

   @IsOptional()
   @IsString()
   @ApiProperty({ description: 'Order status', example: 'Pending' })
   status: OrderStatus;

   @IsOptional()
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

   @IsString()
   @IsOptional()
   @ApiProperty({
      description: 'Shipping address',
      example: '1234 Main Street',
   })
   shippedTo: string;

   @IsString()
   @IsOptional()
   @ApiProperty({ description: 'User ID', example: '1234567890' })
   userId: string;

   @ApiProperty({
      description: 'Array of cart items',
      example: [
         {
            quantity: 2,
            totalPrice: 1,
            orderItemId: '574c3d35-0e6f-4141-8e90-f018a803fd59',
         },
         {
            quantity: 3,
            totalPrice: 2,
            orderItemId: '9876543210',
         },
      ],
      type: [OrderItemUpdateDto],
   })
   @Type(() => OrderItemUpdateDto)
   orderItems: OrderItemUpdateDto[];
}

export class OrderDto {
   @IsOptional()
   @IsDate()
   @ApiProperty({ description: 'Order date', example: '2023-07-27' })
   orderDate: Date;

   @IsOptional()
   @IsString()
   @ApiProperty({ description: 'Order status', example: 'Pending' })
   status: OrderStatus;

   @IsOptional()
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

   @IsString()
   @IsOptional()
   @ApiProperty({
      description: 'Shipping address',
      example: '1234 Main Street',
   })
   shippedTo: string;

   @IsString()
   @IsOptional()
   @ApiProperty({ description: 'User ID', example: '1234567890' })
   userId: string;
}

export class OrderItemDto {
   @IsNumber()
   @IsOptional()
   @ApiProperty({ description: 'Quantity of the item', example: 2 })
   quantity: number;

   @IsNumber()
   @IsOptional()
   @ApiProperty({ description: 'Total price of the item', example: 1 })
   totalPrice: number;
}

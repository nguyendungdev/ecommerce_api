import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderItemDto } from '@order-item/dto/create-order-item.dto';
import { OrderStatus } from '../order-status.enum';

export class CreateOrderDto {
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

  @ApiProperty({
    description: 'Array of cart items',
    example: [
      {
        quantity: 2,
        product_id: '32c755a0-7428-455e-a6d3-66689b48c8e9',
      },
      {
        quantity: 3,
        product_id: '996332db-281d-41dc-aa65-c7c19b70a9f3',
      },
    ],
    type: [CreateOrderItemDto],
  })
  @Type(() => CreateOrderItemDto)
  order_items: CreateOrderItemDto[];
}

import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Quantity of the item', example: 2 })
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the product',
    example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
  })
  product_id: string;
}

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
    example: '04a3ac64-03ca-4b22-af34-c47943e47176',
  })
  product_id: string;
}

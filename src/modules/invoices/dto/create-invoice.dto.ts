import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @ApiProperty({ example: 'INV-20230714', description: 'Invoice number' })
  number: string;

  @IsDate()
  @ApiProperty({ example: '2023-07-14', description: 'Invoice date' })
  invoice_date: Date;

  @IsDate()
  @ApiProperty({ example: '2023-07-21', description: 'Due date' })
  due_date: Date;

  @IsDate()
  @ApiProperty({ example: '2023-07-21 12:00:00', description: 'Payment date' })
  payment_date: Date;

  @IsString()
  order_id: string;

  @IsString()
  @ApiProperty({
    example: 'da400369-2342-42c1-980f-17d3519267aa',
    description: `payment's id`,
  })
  payment_id: string;
}

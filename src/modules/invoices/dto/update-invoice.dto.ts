import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsOptional } from 'class-validator';

export class UpdateInvoiceDto {
   @IsString()
   @IsOptional()
   @ApiProperty({ example: 'INV-20230714', description: 'Invoice number' })
   number: string;

   @IsDate()
   @IsOptional()
   @ApiProperty({ example: '2023-07-14', description: 'Invoice date' })
   invoice_date: Date;

   @IsOptional()
   @IsDate()
   @ApiProperty({ example: '2023-07-21', description: 'Due date' })
   due_date: Date;

   @IsDate()
   @IsOptional()
   @ApiProperty({ example: '2023-07-21 12:00:00', description: 'Payment date' })
   payment_date: Date;

   @IsString()
   @IsOptional()
   order_id: string;

   @IsString()
   @IsOptional()
   @ApiProperty({
      example: 'da400369-2342-42c1-980f-17d3519267aa',
      description: `payment's id`,
   })
   payment_id: string;
}

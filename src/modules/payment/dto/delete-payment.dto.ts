import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class DeletePaymentDto {
   @ApiProperty({
      example: '86c504ac-9d66-475d-bc14-7bafa79e6737',
      description: 'The ID of the user',
   })
   @IsString()
   userId: string;

   @ApiProperty({
      example: 'd7e98d89-bcf9-4362-9c02-8940454eddf6',
      description: 'The ID of the payment',
   })
   @IsString()
   id: string;
}

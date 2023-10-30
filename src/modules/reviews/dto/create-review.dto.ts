import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDTO {
   @ApiProperty({
      example: 'Stripe',
      description: 'The provider of the review',
   })
   @IsString()
   @IsNotEmpty()
   comment: string;

   @ApiProperty({
      example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
      description: 'The ID of the related product',
   })
   @IsNotEmpty()
   @IsString()
   product_id: string;

   @ApiProperty({
      example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
      description: 'The ID of the related rating',
   })
   @IsNotEmpty()
   @IsString()
   rating_id: string;

   @ApiProperty({
      example: '574c3d35-0e6f-4141-8e90-f018a803fd59',
      description: 'The ID of the related user',
   })
   @IsNotEmpty()
   @IsString()
   user_id: string;
}

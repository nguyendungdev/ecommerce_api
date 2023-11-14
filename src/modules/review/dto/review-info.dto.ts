import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ReviewInfoDTO {
   @ApiProperty({
      example: `example@gmail.com`,
      description: 'The email of the user who left the comment',
   })
   @IsString()
   @IsNotEmpty()
   email: string;

   @ApiProperty({
      example: 5,
      description: 'The rating point given by the user',
   })
   @IsNumber()
   @IsNotEmpty()
   rating_point: number;

   @ApiProperty({
      example: 'example comment',
      description: "The user's comment about the product",
   })
   @IsString()
   @IsNotEmpty()
   comment: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
   @ApiProperty({
      description: `Category's name`,
      example: `Laptop`,
   })
   @IsOptional()
   @IsString()
   name: string;

   @ApiProperty({
      description: `Category's description`,
      example: ``,
   })
   @IsOptional()
   @IsString()
   description: string;
}

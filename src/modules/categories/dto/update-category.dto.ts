import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
   @ApiProperty({
      description: `Category's name`,
      example: `Example category's name`,
   })
   @IsOptional()
   @IsString()
   name: string;

   @ApiProperty({
      description: `Example category's description`,
      example: ``,
   })
   @IsOptional()
   @IsString()
   description: string;
}

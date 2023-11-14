import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class CreateCategoryDto {
  @ApiProperty({
    description: `Category's name`,
    example: `Example category's name`,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: `Category's description`,
    example: `Example category's description`,
  })
  @IsOptional()
  @IsString()
  description: string;
}

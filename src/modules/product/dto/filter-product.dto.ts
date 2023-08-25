import { IsOptional, IsString, IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterProductDTO {
   @IsOptional()
   @IsString()
   name: string;
}

import {
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateProductDTO {
    @ApiProperty({
        example: 'Product Name',
        description: 'The name of the product',
    })
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty({
        example: 200,
        description: 'The base price of the product',
    })
    @IsNumber()
    @IsOptional()
    base_price: number;

    @ApiProperty({
        example: 0,
        description: 'The product discount in percentage',
    })
    @IsNumber()
    @IsOptional()
    discount_percentage: number;

    @ApiProperty({
        example: 'img_url',
        description: 'The picture of the product',
    })
    @IsString()
    @IsOptional()
    img_url: string;

    @ApiProperty({ example: 30, description: `stock` })
    @IsInt()
    @IsOptional()
    stock: number;

    @ApiProperty({
        example: '',
        description: "The product's description",
    })
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({
        example: ['574c3d35-0e6f-4141-8e90-f018a803fd59'],
        description: 'The ID of the related category',
    })
    @IsOptional()
    @IsString()
    category_id: string[];
}

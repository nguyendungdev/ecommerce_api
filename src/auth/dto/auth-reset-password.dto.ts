import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User password.',
    example: '123456@Abc',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  hash: string;
}

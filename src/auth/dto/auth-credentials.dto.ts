import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '@users/roles.enum';

export default class AuthCreadentialsDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User email.',
    example: 'admin@example.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User password.',
    example: 'secret',
  })
  password: string;
  @IsOptional()
  @ApiProperty({
    description: 'User roles.',
    example: ['User'],
  })
  roles: Role[];
}

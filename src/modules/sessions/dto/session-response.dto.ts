import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Role } from '@users/roles.enum';
export class SessionResponseDto {
  @IsEmail()
  @ApiProperty({
    description: 'User email.',
    example: 'example@test.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'User password.',
    example: '123456@Abc',
  })
  password: string;

  @IsOptional()
  @ApiProperty({
    description: 'User roles.',
    example: ['User'],
  })
  roles: Role[];
}

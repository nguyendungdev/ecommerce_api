import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '../../modules//user/roles.enum';

export default class AuthCreadentialsDto {
   @IsNotEmpty()
   @IsEmail()
   @ApiProperty({
      description: 'User email.',
      example: 'example@test.com',
   })
   email: string;

   @IsNotEmpty()
   @IsString()
   @ApiProperty({
      description: 'User password.',
      example: '123456@Abc',
   })
   password: string;
   @IsOptional()
   @ApiProperty({
      description: 'User roles.',
      example: ['user', 'admin'],
   })
   roles: Role[];
}

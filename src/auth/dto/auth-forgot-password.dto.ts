import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '@common/transformer/lower-case.transformer';

export class AuthForgotPasswordDto {
  @ApiProperty()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;
}

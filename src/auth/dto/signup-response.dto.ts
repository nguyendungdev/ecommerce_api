import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class SignUpResponseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User email.',
    example: 'example@test.com',
  })
  token: string;
}

import {
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class SignUpDto {
  @ApiProperty({
    description: '이름',
    required: true,
    example: 'Ethan',
  })
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    description: '핸드폰 번호',
    required: false,
  })
  @IsOptional()
  public phoneNumber?: string;

  @ApiProperty({
    description: '이메일 주소',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  public email?: string;

  @ApiProperty({
    description: '패스워드',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  public password: string;
}

export default SignUpDto;

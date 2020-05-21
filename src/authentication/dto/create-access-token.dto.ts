import {
  IsString,
  IsPhoneNumber,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateAccessTokenDto {
  @ApiProperty({
    description: '핸드폰 번호',
  })
  @IsPhoneNumber('KR')
  @IsOptional()
  public phoneNumber?: string;

  @ApiProperty({
    description: '이메일 주소',
  })
  @IsEmail()
  @IsOptional()
  public email?: string;

  @ApiProperty({
    description: '패스워드',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  public password: string;
}

export default CreateAccessTokenDto;

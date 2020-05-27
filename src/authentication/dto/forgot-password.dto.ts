import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

class ForgotPasswrodDto {
  @ApiProperty({
    description: '이메일 주소',
    required: false,
  })
  @IsOptional()
  public email?: string;

  @ApiProperty({
    description: '핸드폰 번호',
    required: false,
  })
  @IsOptional()
  public phoneNumber?: string;
}

export default ForgotPasswrodDto;

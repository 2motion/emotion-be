import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import VerifyDto from './verify.dto';

class ResetPasswordDto extends VerifyDto {
  @ApiProperty({
    description: '새로운 패스워드',
    required: false,
  })
  @IsNotEmpty()
  public newPassword: string;
}

export default ResetPasswordDto;

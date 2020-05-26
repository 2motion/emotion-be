import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ResendVerifyCodeDto {
  @ApiProperty({
    required: true,
    example: 1,
  })
  public verifyId: number;

  @ApiProperty({
    description: 'HashKey',
    required: true,
  })
  @IsNotEmpty()
  public hashKeyPair: string;
}

export default ResendVerifyCodeDto;

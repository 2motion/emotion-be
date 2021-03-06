import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class VerifyDto {
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
  public hashKey: number;

  @ApiProperty({
    description: 'HashKey',
    required: true,
  })
  @IsNotEmpty()
  public hashKeyPair: string;
}

export default VerifyDto;

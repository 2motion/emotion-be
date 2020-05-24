import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';
import { Type } from 'class-transformer';

class SignUpModel {
  @ApiProperty({
    required: true,
    example: 1,
  })
  public verifyId: number;

  @Type(() => Number)
  @ApiProperty({
    required: true,
    example: moment(new Date()).format('x'),
  })
  public expiredAt: number;

  @ApiProperty({
    required: true,
  })
  public hashKeyPair: string;
}

export default SignUpModel;

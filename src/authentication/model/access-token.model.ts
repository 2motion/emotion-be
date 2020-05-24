import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';

class AccessTokenModel {
  @ApiProperty({
    required: true,
  })
  public token: string;

  @ApiProperty({
    required: true,
    example: Number(moment().format('x')),
  })
  public expiredAt: number;
}

export default AccessTokenModel;

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

class UpdateProfileDto {
  @ApiProperty({
    description: '소개',
  })
  @IsOptional()
  public bio: string;

  @ApiProperty({
    description: '아바타 이미지',
    type: 'string',
    format: 'binary',
  })
  public avatarImage: Express.Multer.File;
}

export default UpdateProfileDto;

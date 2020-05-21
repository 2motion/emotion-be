import { IsOptional, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateArticleDto {
  @ApiProperty({
    description: '제목',
    required: true,
  })
  @MaxLength(200)
  @MinLength(1)
  @IsNotEmpty()
  public title: string;

  @ApiProperty({
    description: '본문',
  })
  @IsOptional()
  public body?: string;

  @ApiProperty({
    description: '첨부할 사진',
  })
  @IsOptional()
  public photos: File[];
}

export default CreateArticleDto;

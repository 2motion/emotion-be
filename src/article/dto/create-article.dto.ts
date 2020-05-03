import { IsOptional, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

class CreateArticleDto {
  @MaxLength(200)
  @MinLength(1)
  @IsNotEmpty()
  public title: string;

  @IsOptional()
  public body?: string;

  @IsOptional()
  public photos: File[];
}

export default CreateArticleDto;

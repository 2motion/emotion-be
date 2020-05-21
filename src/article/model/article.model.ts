import { ApiProperty } from '@nestjs/swagger';

class ArticleModel {
  @ApiProperty({
    description: 'Article 아이디',
    example: 1,
  })
  public id: number;

  @ApiProperty({
    description: '제목',
  })
  public title: string;

  @ApiProperty({
    description: '본문',
  })
  public body: string;

  @ApiProperty({
    description: '생성 시간',
  })
  public createdAt: number;

  @ApiProperty({
    description: '업데이트 시간',
  })
  public updatedAt: number;
}

export default ArticleModel;

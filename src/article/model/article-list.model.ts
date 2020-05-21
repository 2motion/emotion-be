import ArticleModel from '@app/article/model/article.model';
import { ApiProperty } from '@nestjs/swagger';

class ArticleListModel {
  @ApiProperty({
    description: 'Article 목록',
    type: Number,
    example: 0,
  })
  public rows: ArticleModel[];

  @ApiProperty({
    description: '요청 목록 전체 수',
    type: Number,
    example: 0,
  })
  public count: number;
}

export default ArticleListModel;

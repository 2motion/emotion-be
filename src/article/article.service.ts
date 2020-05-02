import { Injectable, Inject } from '@nestjs/common';
import { ArticleEntity } from '../entities/article.entity';

@Injectable()
export class ArticleService {
  public constructor(
    @Inject('ARTICLE_REPOSITORY')
    private articleRepository: typeof ArticleEntity,
  ) {}

  public findAll() {
    return this.articleRepository.findAll();
  }
}

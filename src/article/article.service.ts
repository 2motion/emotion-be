import { Injectable, Inject } from '@nestjs/common';
import { ArticleEntity } from '../entities/article.entity';
import CreateArticleDto from './dto/create-article.dto';
import { from, Observable } from 'rxjs';
import ArticleModel from './model/article.model';
import { map } from 'rxjs/operators';
import ArticleServiceInterface from './interfaces/article.service.interface';

@Injectable()
export class ArticleService implements ArticleServiceInterface {
  public constructor(
    @Inject('ARTICLE_REPOSITORY')
    private articleRepository: typeof ArticleEntity,
  ) {}

  public findAndCountAll(): Observable<{
    rows: ArticleModel[];
    count: number;
  }> {
    return from(
      this.articleRepository.findAndCountAll({
        attributes: [
          'id',
          'title',
          'body',
          'createdAt',
          'updatedAt',
          'isEnabledComment',
        ],
      }),
    ).pipe(
      map(({ rows, count }) => {
        const convertedRow = [];
        for (let row of rows) {
          convertedRow.push(this.convert(row));
        }
        return { rows: convertedRow, count };
      }),
    );
  }

  public create(
    createArticleDto: CreateArticleDto,
    accountId: number,
  ): Observable<ArticleModel> {
    return from(
      this.articleRepository.create({
        ...createArticleDto,
        ...{ accountId },
      }),
    ).pipe(map(articleEntity => this.convert(articleEntity)));
  }

  public convert(articleEntity: ArticleEntity): ArticleModel {
    const article = new ArticleModel();

    article.id = articleEntity.getDataValue('id');
    article.title = articleEntity.getDataValue('title');
    article.body = articleEntity.getDataValue('body');

    return article;
  }
}

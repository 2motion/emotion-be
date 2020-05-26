import CreateArticleDto from '../dto/create-article.dto';
import { Observable } from 'rxjs';
import ArticleModel from '../model/article.model';
import { ArticleEntity } from '@app/entities/article.entity';

interface ArticleServiceInterface {
  findAndCountAll(): Observable<{ rows: ArticleModel[]; count: number }>;
  getArticleById(articleId: number): Observable<ArticleModel>;
  create(
    createArticleDto: CreateArticleDto,
    accountId: number,
  ): Observable<ArticleModel>;
  convert(articleEntity: ArticleEntity): ArticleModel;
}

export default ArticleServiceInterface;

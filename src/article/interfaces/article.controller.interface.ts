import CreateArticleDto from '../dto/create-article.dto';
import JwtDecodedInterface from '@app/shared/interface/jwt-decoded.interface';
import { Observable } from 'rxjs';
import ArticleModel from '../model/article.model';

interface ArticleControllerInterface {
  findAndCountAll(): Observable<{ count: number; rows: ArticleModel[] }>;
  create(
    createArticleDto: CreateArticleDto,
    { accountId }: JwtDecodedInterface,
    {
      images,
      audio,
    }: {
      images?: Express.Multer.File[];
      audio?: Express.Multer.File;
    },
  ): Observable<ArticleModel>;
}

export default ArticleControllerInterface;

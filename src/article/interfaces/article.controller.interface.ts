import CreateArticleDto from '../dto/create-article.dto';
import JwtDecodedInterface from '@app/shared/interface/jwt-decoded.interface';
import { Observable } from 'rxjs';
import ArticleModel from '../model/article.model';

interface ArticleControllerInterface {
  create(
    createArticleDto: CreateArticleDto,
    { accountId }: JwtDecodedInterface,
  ): Observable<ArticleModel>;
}

export default ArticleControllerInterface;

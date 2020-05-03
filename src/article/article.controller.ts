import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import ArticleControllerInterface from './interfaces/article.controller.interface';
import { ArticleService } from './article.service';
import { AuthGuard } from '@app/shared/guard/auth.guard';
import CreateArticleDto from './dto/create-article.dto';
import JwtDecodedInterface from '@app/shared/interface/jwt-decoded.interface';
import { DecodedToken } from '@app/shared/decorator/decoded-token.decorator';
import { Observable } from 'rxjs';
import ArticleModel from './model/article.model';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { concatMap } from 'rxjs/operators';

@UseGuards(AuthGuard)
@Controller('articles')
export class ArticleController implements ArticleControllerInterface {
  public constructor(
    private readonly articleService: ArticleService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Get()
  public findAndCountAll() {
    return this.articleService.findAndCountAll();
  }

  @Post()
  public create(
    @Body() createArticleDto: CreateArticleDto,
    @DecodedToken() { accountId }: JwtDecodedInterface,
  ): Observable<ArticleModel> {
    return this.authenticationService.findById(accountId).pipe(
      concatMap(account => {
        if (!account) {
          throw new BadRequestException();
        }

        if (account.isPending || account.isBlock) {
          throw new UnauthorizedException();
        }

        console.log('createArticleDto');
        return this.articleService.create(createArticleDto, accountId);
      }),
    );
  }
}

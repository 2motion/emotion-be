import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
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
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonResponseReceiptDecorator } from '@app/shared/decorator/common-response-receipt.decorator';
import ArticleListModel from './model/article-list.model';

@ApiTags('articles')
@Controller('articles')
export class ArticleController implements ArticleControllerInterface {
  public constructor(
    private readonly articleService: ArticleService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ArticleListModel,
  })
  @ApiOperation({ summary: 'Article 정보를 응답한다.' })
  @CommonResponseReceiptDecorator()
  @Get()
  public findAndCountAll() {
    return this.articleService.findAndCountAll();
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ArticleModel,
  })
  @ApiOperation({ summary: 'Article 정보를 생성한다.' })
  @CommonResponseReceiptDecorator()
  @UseGuards(AuthGuard)
  @Post()
  public create(
    @Body() createArticleDto: CreateArticleDto,
    @DecodedToken() { accountId }: JwtDecodedInterface,
  ): Observable<ArticleModel> {
    return this.authenticationService.findById(accountId).pipe(
      concatMap((account) => {
        if (!account) {
          throw new BadRequestException();
        }

        if (account.isPending || account.isBlock) {
          throw new UnauthorizedException();
        }

        return this.articleService.create(createArticleDto, accountId);
      }),
    );
  }
}

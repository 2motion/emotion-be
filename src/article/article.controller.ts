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
  UseInterceptors,
  UploadedFiles,
  Param,
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
import { concatMap, map } from 'rxjs/operators';
import * as mimeType from 'mime-types';
import {
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { CommonResponseReceiptDecorator } from '@app/shared/decorator/common-response-receipt.decorator';
import ArticleListModel from './model/article-list.model';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BaseController } from '@app/base.controller';

@ApiTags('articles')
@Controller('articles')
export class ArticleController extends BaseController
  implements ArticleControllerInterface {
  public constructor(
    private readonly articleService: ArticleService,
    private readonly authenticationService: AuthenticationService,
  ) {
    super();
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ArticleListModel,
  })
  @ApiOperation({ summary: 'Article 정보를 응답한다.' })
  @CommonResponseReceiptDecorator()
  @Get()
  public findAndCountAll(): Observable<{
    count: number;
    rows: ArticleModel[];
  }> {
    return this.articleService.findAndCountAll();
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ArticleListModel,
  })
  @ApiOperation({ summary: 'Article 상세 정보를 응답한다.' })
  @CommonResponseReceiptDecorator()
  @Get(':articleId')
  public findById(
    @Param('articleId') articleId: number,
  ): Observable<ArticleModel> {
    return this.articleService.getArticleById(articleId);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ArticleModel,
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'images',
          maxCount: 3,
        },
        {
          name: 'audio',
          maxCount: 1,
        },
      ],
      {
        fileFilter: (_req: Request, file, cb) => {
          const extension = mimeType.extension(file.mimetype) as string;
          if (
            !['jpg', 'jpeg', 'png', 'gif', 'mp3', 'mp4', 'mpga'].includes(
              extension,
            )
          ) {
            return cb(
              new BadRequestException('지원하지 않는 확장자 입니다.'),
              false,
            );
          }

          return cb(null, true);
        },
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Article 정보를 생성한다.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @CommonResponseReceiptDecorator()
  @Post()
  public create(
    @Body() createArticleDto: CreateArticleDto,
    @DecodedToken() { accountId }: JwtDecodedInterface,
    @UploadedFiles()
    {
      images,
      audio,
    }: {
      images?: Express.Multer.File[];
      audio?: Express.Multer.File;
    },
  ): Observable<ArticleModel> {
    return this.authenticationService.findById(accountId).pipe(
      concatMap((account) => {
        if (!account) {
          throw new BadRequestException();
        }

        if (account.isPending || account.isBlock) {
          throw new UnauthorizedException();
        }

        if (images) {
          return this.articleService.create(createArticleDto, accountId).pipe(
            concatMap((articleEntity) => {
              return this.articleService
                .uploadFiles(articleEntity.id, {
                  ...images,
                  ...audio,
                })
                .pipe(map(() => articleEntity));
            }),
          );
        }
        return this.articleService.create(createArticleDto, accountId);
      }),
      concatMap(({ id }) => {
        return this.articleService.getArticleById(id);
      }),
    );
  }
}

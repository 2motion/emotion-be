import { Injectable, Inject } from '@nestjs/common';
import { ArticleEntity } from '../entities/article.entity';
import CreateArticleDto from './dto/create-article.dto';
import { from, Observable, forkJoin } from 'rxjs';
import ArticleModel from './model/article.model';
import { map, concatMap } from 'rxjs/operators';
import ArticleServiceInterface from './interfaces/article.service.interface';
import FileStorageUtil from '@app/util/file-storage.util';
import { FileEntity } from '@app/entities/file.entity';
import { ArticleFileEntity } from '@app/entities/article-file.entity';

@Injectable()
export class ArticleService implements ArticleServiceInterface {
  public constructor(
    @Inject('ARTICLE_REPOSITORY')
    private articleRepository: typeof ArticleEntity,
    @Inject('ARTICLE_FILE_REPOSITORY')
    private articleFileRepository: typeof ArticleFileEntity,
    @Inject('FILE_REPOSITORY')
    private fileRepository: typeof FileEntity,
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
    ).pipe(map((articleEntity) => this.convert(articleEntity)));
  }

  public convert(articleEntity: ArticleEntity): ArticleModel {
    const article = new ArticleModel();

    article.id = articleEntity.getDataValue('id');
    article.title = articleEntity.getDataValue('title');
    article.body = articleEntity.getDataValue('body');

    return article;
  }

  public uploadFile(
    articleId: number,
    file: Express.Multer.File,
  ): Observable<ArticleFileEntity> {
    const isImage = file.originalname.match(/.(jpg|jpeg|png|gif)$/i);
    return from(
      FileStorageUtil.saveToRemote(file.originalname, file.buffer),
    ).pipe(
      concatMap((hashKey) => {
        return from(
          this.fileRepository.create({
            hashKey,
            name: file.originalname,
          }),
        );
      }),
      concatMap((fileEntity) =>
        from(
          this.articleFileRepository.create({
            fileId: fileEntity.id,
            articleId,
            type: isImage ? 'image' : 'audio',
          }),
        ),
      ),
    );
  }

  public uploadFiles(articleId: number, files: Express.Multer.File[]) {
    return forkJoin(files.map((file) => this.uploadFile(articleId, file)));
  }
}

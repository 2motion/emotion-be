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
import { ConfigService } from '@nestjs/config';
import { Repository } from 'sequelize-typescript';

@Injectable()
export class ArticleService implements ArticleServiceInterface {
  public constructor(
    @Inject('ARTICLE_REPOSITORY')
    private readonly articleRepository: Repository<ArticleEntity>,
    @Inject('ARTICLE_FILE_REPOSITORY')
    private readonly articleFileRepository: Repository<ArticleFileEntity>,
    @Inject('FILE_REPOSITORY')
    private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService,
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
        include: [
          {
            model: this.articleFileRepository,
            include: [
              {
                model: this.fileRepository,
              },
            ],
          },
        ],
        order: [['id', 'desc']],
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

  public getArticleById(articleId: number): Observable<ArticleModel> {
    return from(
      this.articleRepository.findByPk(articleId, {
        attributes: [
          'id',
          'title',
          'body',
          'createdAt',
          'updatedAt',
          'isEnabledComment',
        ],
        include: [
          {
            model: this.articleFileRepository,
            include: [
              {
                model: this.fileRepository,
              },
            ],
          },
        ],
      }),
    ).pipe(map((articleEntity) => this.convert(articleEntity)));
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
    article.images = [];

    if (articleEntity.files) {
      for (let i = 0; i < articleEntity.files.length; i++) {
        const imagePath = `${this.configService.get('STATIC_IMAGE_HOST')}/${
          articleEntity.files[i].file.hashKey
        }`;
        article.images.push(imagePath);
      }
    }

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
    return forkJoin(
      Object.keys(files).map((fileKey) =>
        this.uploadFile(articleId, files[fileKey]),
      ),
    );
  }
}

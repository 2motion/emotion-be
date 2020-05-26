import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  DataType,
  AutoIncrement,
  PrimaryKey,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ArticleEntity } from './article.entity';
import { FileEntity } from './file.entity';
import ArticleFileType from '@app/constants/article-file-type';

@Table
export class ArticleFileEntity extends Model<ArticleFileEntity> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  public id: number;

  @ForeignKey(() => ArticleEntity)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  public articleId: number;

  @ForeignKey(() => FileEntity)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  public fileId: number;

  @AllowNull(false)
  @Column(DataType.TINYINT)
  public type: ArticleFileType;

  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  public createdAt: Date;

  @UpdatedAt
  @AllowNull(true)
  @Column(DataType.DATE)
  public updatedAt: Date;

  @DeletedAt
  @AllowNull(true)
  @Column(DataType.DATE)
  public deleteAt: Date;

  @BelongsTo(() => FileEntity)
  public file: FileEntity;
}

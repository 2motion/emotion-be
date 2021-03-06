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
  BelongsTo,
  ForeignKey,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { AccountEntity } from './account.entity';
import { ArticleFileEntity } from './article-file.entity';

@Table
export class ArticleEntity extends Model<ArticleEntity> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  public id: number;

  @AllowNull(false)
  @Column(DataType.CHAR(100))
  public title: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  public body: string;

  @ForeignKey(() => AccountEntity)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  public accountId: number;

  @Default(1)
  @AllowNull(false)
  @Column(DataType.TINYINT)
  public isEnabledComment: number;

  @Default(0)
  @AllowNull(false)
  @Column(DataType.TINYINT)
  public isDraft: number;

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

  @AllowNull(true)
  @Column(DataType.CHAR(200))
  public audioFileHashKey: string;

  @BelongsTo(() => AccountEntity)
  public account: AccountEntity;

  @HasMany(() => ArticleFileEntity, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  public files: ArticleFileEntity[];
}

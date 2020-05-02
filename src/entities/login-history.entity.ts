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
  Unique,
} from 'sequelize-typescript';

@Table
export class LoginHistoryEntity extends Model<LoginHistoryEntity> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  public id: number;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  public accountId: string;

  @AllowNull(false)
  @Column(DataType.TINYINT())
  public isFailed: number;

  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  public createdAt: Date;

  @UpdatedAt
  @AllowNull(true)
  @Column(DataType.DATE)
  public updatedAt: Date;
}

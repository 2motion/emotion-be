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
  Default,
} from 'sequelize-typescript';
import { AccountEntity } from './account.entity';

@Table
export class AccountVerfiyEntity extends Model<AccountVerfiyEntity> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  public id: number;

  @ForeignKey(() => AccountEntity)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  public accountId: number;

  @AllowNull(false)
  @Column(DataType.INTEGER('4'))
  public hashKey: number;

  @AllowNull(false)
  @Column(DataType.CHAR)
  public hashKeyPair: string;

  @Default(0)
  @AllowNull(false)
  @Column(DataType.TINYINT)
  public isVerified: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  public expiredAt: number;

  @Default(0)
  @AllowNull(false)
  @Column(DataType.TINYINT)
  public attempts: number;

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

  @BelongsTo(() => AccountEntity)
  public account: AccountEntity;
}

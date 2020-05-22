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
  @Column(DataType.TINYINT)
  public hashKey: number;

  @AllowNull(false)
  @Column(DataType.TINYINT)
  public isVerified: number;

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
}

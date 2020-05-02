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
  Default,
} from 'sequelize-typescript';

@Table
export class AccountEntity extends Model<AccountEntity> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  public id: number;

  @AllowNull(true)
  @Column(DataType.CHAR(20))
  public phoneNumber: string;

  @AllowNull(true)
  @Column(DataType.CHAR(20))
  public email: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  public password: number;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.TINYINT)
  public isPending: number;

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

import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  AutoIncrement,
  PrimaryKey,
  AllowNull,
  Default,
} from 'sequelize-typescript';

@Table
export class SmsHistoryEntity extends Model<SmsHistoryEntity> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  public id: number;

  @AllowNull(false)
  @Column(DataType.CHAR)
  public phoneNumber: string;

  @Column(DataType.TINYINT())
  public type: number;

  @Default(0)
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

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
  Unique,
  ForeignKey,
  // AfterCreate,
  BelongsTo,
  AfterCreate,
} from 'sequelize-typescript';
import { AccountProfileEntity } from './account-profile.entity';

@Table
export class AccountEntity extends Model<AccountEntity> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  public id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.CHAR(30))
  public name: string;

  @AllowNull(true)
  @Column(DataType.CHAR(20))
  public phoneNumber: string;

  @AllowNull(true)
  @Column(DataType.CHAR(20))
  public email: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  public password: string;

  @ForeignKey(() => AccountProfileEntity)
  @AllowNull(true)
  @Column(DataType.BIGINT)
  public profileId: number;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.TINYINT)
  public isPending: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.TINYINT)
  public isBlock: number;

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

  @BelongsTo(() => AccountProfileEntity)
  public profile: AccountProfileEntity;

  @AfterCreate
  public static async onAfterCreate(instance: AccountEntity) {
    instance.sequelize.transaction(async (transaction) => {
      const profile = await AccountProfileEntity.create({
        accountId: instance.id,
        transaction,
      });

      await instance.update({ profileId: profile.id });
    });
  }
}

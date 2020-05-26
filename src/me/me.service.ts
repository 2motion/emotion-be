import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { from, Observable } from 'rxjs';
import { AccountEntity } from '@app/entities/account.entity';
import { AccountProfileEntity } from '@app/entities/account-profile.entity';
import { FileEntity } from '@app/entities/file.entity';
import FileStorageUtil from '@app/util/file-storage.util';
import { concatMap, map } from 'rxjs/operators';
import UpdateProfileDto from './dto/update-profile.dto';
import ProfileModel from './model/profile.model';
import { ConfigService } from '@nestjs/config';
import * as gravatar from 'gravatar';

@Injectable()
export class MeService {
  public constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private readonly accountRepository: Repository<AccountEntity>,
    @Inject('ACCOUNT_PROFILE_REPOSITORY')
    private readonly fileRepository: Repository<FileEntity>,
    @Inject('ACCOUNT_PROFILE_REPOSITORY')
    private readonly accountProfileRepository: Repository<AccountProfileEntity>,
    private readonly configService: ConfigService,
  ) {}

  public getProfileById(accountId: number): Observable<ProfileModel> {
    const profile$ = this.getProfileAccountEntityById(accountId);
    return profile$.pipe(map((entity) => this.convertFromEntity(entity)));
  }

  public getProfileAccountEntityById(
    accountId: number,
  ): Observable<AccountEntity> {
    return from(
      this.accountRepository.findByPk(accountId, {
        attributes: ['id', 'email', 'name', 'profileId'],
        include: [
          {
            model: this.accountProfileRepository,
            required: true,
          },
        ],
      }),
    );
  }

  public convertFromEntity(accountEntity: AccountEntity): ProfileModel {
    const profile = new ProfileModel();
    profile.name = accountEntity.name;
    if (accountEntity.profile && accountEntity.profile.avatarImage) {
      profile.avatarImage = accountEntity.profile.avatarImage;
    } else {
      profile.avatarImage = accountEntity.email
        ? gravatar.url(accountEntity.email)
        : gravatar.url('me@gamstagram.com');
    }

    return profile;
  }

  public updateProfile(
    accountId: number,
    updateProfileDto: UpdateProfileDto,
  ): Observable<ProfileModel> {
    const updateProfile$ = this.getProfileAccountEntityById(accountId).pipe(
      concatMap((profile) => {
        if (updateProfileDto.avatarImage) {
          return this.uploadAvatarImage(
            accountId,
            updateProfileDto.avatarImage,
          ).pipe(
            concatMap((fileEntity) => {
              return from(
                profile.update({
                  bio: updateProfileDto.bio,
                  avatarImage: `${this.configService.get(
                    'STATIC_IMAGE_HOST',
                  )}/${fileEntity.hashKey}`,
                }),
              );
            }),
          );
        }
        return from(
          profile.update({
            bio: updateProfileDto.bio,
          }),
        );
      }),
    );

    return updateProfile$.pipe(concatMap(({ id }) => this.getProfileById(id)));
  }

  public uploadAvatarImage(
    accountId: number,
    avatarImage: Express.Multer.File,
  ) {
    return this.getProfileAccountEntityById(accountId).pipe(
      concatMap(() => {
        return from(
          FileStorageUtil.saveToRemote(
            avatarImage.originalname,
            avatarImage.buffer,
          ),
        ).pipe(
          concatMap((hashKey) =>
            from(
              this.fileRepository.create({
                hashKey,
                name: avatarImage.originalname,
              }),
            ),
          ),
        );
      }),
    );
  }
}

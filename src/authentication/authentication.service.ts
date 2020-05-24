import {
  Injectable,
  Inject,
  OnModuleDestroy,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountEntity } from '@app/entities/account.entity';
import { from, Observable, Subscription, forkJoin, of } from 'rxjs';
import { pluck, tap, map, concatMap } from 'rxjs/operators';
import AuthenticationServiceInterface from '@app/authentication/interfaces/authentication.service.interface';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InjectEventEmitter } from 'nest-emitter';
import { AppEventEmitter } from '@app/app.events';
import { IncomingWebhook } from '@slack/webhook';
import newMemberNotifyTemplate from '@app/shared/template/slack/new-member-notify.template';
import { AccountVerfiyEntity } from '@app/entities/account-verfiy.entity';
import EmailUtil from '@app/util/email.util';
import SmsUtil from '@app/util/sms.util';
import * as moment from 'moment';
import SignUpModel from './model/sign-up.model';
import { LoginHistoryEntity } from '@app/entities/login-history.entity';
import { SmsHistoryEntity } from '@app/entities/sms-history.entity';
import SmsType from '@app/constants/sms-type';

@Injectable()
export class AuthenticationService
  implements AuthenticationServiceInterface, OnModuleDestroy {
  public subscriptions: Subscription[] = [];

  public constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private readonly accountRepository: typeof AccountEntity,
    @Inject('ACCOUNT_VERFIY_REPOSITORY')
    private readonly accountVerfiyRepository: typeof AccountVerfiyEntity,
    @Inject('LOGIN_HISTORY_REPOSITORY')
    private readonly loginHistoryRepository: typeof LoginHistoryEntity,
    @Inject('SMS_HISTORY_REPOSITORY')
    private readonly smsHistoryRepository: typeof SmsHistoryEntity,
    private readonly configService: ConfigService,
    @InjectEventEmitter() private readonly emitter: AppEventEmitter,
  ) {}

  public onModuleDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public saveLoginHistory(accountId: number, isFailed: boolean = false) {
    return from(
      this.loginHistoryRepository.create({
        accountId,
        isFailed,
      }),
    );
  }

  public createAccessToken(account: AccountEntity): string {
    return jwt.sign(
      { accountId: account.id },
      this.configService.get<string>('ACCESS_TOKEN_PRIVATE_KEY'),
      {
        expiresIn: 60 * 60 * (24 * 3),
      },
    );
  }

  public verify(
    verifyId: number,
    hashKey: number,
    hashKeyPair: string,
  ): Observable<void> {
    return from(
      this.accountVerfiyRepository.findOne({
        where: {
          id: verifyId,
        },
        include: [
          {
            model: this.accountRepository,
            required: true,
          },
        ],
      }),
    ).pipe(
      concatMap((verifyEntity) => {
        if (!verifyEntity) {
          throw new BadRequestException('잘 못된 인증 요청 입니다.');
        }

        if (moment().isAfter(verifyEntity.expiredAt)) {
          throw new BadRequestException('인증 시간이 만료되었습니다.');
        }

        if (verifyEntity.attempts > 3) {
          throw new UnauthorizedException();
        }

        if (
          verifyEntity.hashKey !== hashKey ||
          verifyEntity.hashKeyPair !== hashKeyPair
        ) {
          return from(
            verifyEntity.update({
              attempts: ++verifyEntity.attempts,
            }),
          );
        }

        return from(
          verifyEntity.account.update({
            isPending: true,
          }),
        ).pipe(concatMap(() => verifyEntity.update({ isVerified: 1 })));
      }),
      map(() => {}),
    );
  }

  public verfiyPassword(password: string, encryptedPassword: string): boolean {
    return bcrypt.compareSync(password, encryptedPassword);
  }

  public encryptedPassword(password: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
  }

  public findById(accountId: number): Observable<AccountEntity> {
    return from(this.accountRepository.findByPk(accountId));
  }

  public findByPhoneNumber(phoneNumber: string): Observable<AccountEntity> {
    return from(
      this.accountRepository.findOne({
        where: { phoneNumber },
      }),
    );
  }

  public findByEmail(email: string): Observable<AccountEntity> {
    return from(
      this.accountRepository.findOne({
        where: { email },
      }),
    );
  }

  public createVerifyHashKeyAndSave(
    accountId: number,
  ): Observable<AccountVerfiyEntity> {
    const hashKey = Math.floor(1000 + Math.random() * 9000);
    const hashKeyPair = [
      (Math.random() * 1e32).toString(36),
      (Math.random() * 2e32).toString(36),
      (Math.random() * 1e32).toString(36),
    ].join((Math.random() * 1e32).toString(36));
    const expiredAt = moment().add(10, 'minutes').format('x');

    return from(
      this.accountVerfiyRepository.create({
        hashKey,
        hashKeyPair,
        accountId,
        expiredAt,
      }),
    );
  }

  public sendVerifyPhoneNumber(phoneNumber: string, verifyHash: number) {
    const smsClient = new SmsUtil(
      this.configService.get('APP_AWS_ACCESS_KEY_ID'),
      this.configService.get('APP_AWS_SECRET_ACCESS_KEY'),
    );
    const PNF = require('google-libphonenumber').PhoneNumberFormat;
    const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber, 'KR');
    const maximumDailySms = 3;

    return from(
      this.smsHistoryRepository.count({
        where: { phoneNumber, type: SmsType.Authentication },
      }),
    ).pipe(
      map((sentCount) => {
        if (sentCount > maximumDailySms) {
          throw new BadRequestException('일일 최대 발송 수를 초과했습니다.');
        }
        return smsClient.send({
          Message: `[Gamstagram] 인증번호는 ${verifyHash} 입니다.`,
          MessageStructure: 'string',
          PhoneNumber: phoneUtil.format(number, PNF.E164),
        });
      }),
      tap(() =>
        this.subscriptions.push(
          from(
            this.smsHistoryRepository.create({
              phoneNumber,
              type: SmsType.Authentication,
            }),
          ).subscribe(),
        ),
      ),
    );
  }

  public sendVerifyEmail(accountEmailAddress: string, verifyHash: number) {
    const mailClient = new EmailUtil(
      this.configService.get('APP_AWS_ACCESS_KEY_ID'),
      this.configService.get('APP_AWS_SECRET_ACCESS_KEY'),
    );

    return of(
      mailClient.send({
        Destination: {
          ToAddresses: [accountEmailAddress],
        },
        Message: {
          Body: {
            Text: {
              Data: `인증 번호는 ${verifyHash} 입니다.`,
              Charset: 'utf-8',
            },
          },
          Subject: {
            Data: '[Gamstagram] 회원가입 인증을 마무리 해주세요.',
            Charset: 'utf-8',
          },
        },
        Source: 'suuport@gamstagram.com',
      }),
    );
  }

  private signUpNotify(accountId: number): Observable<void> {
    return forkJoin([
      this.accountRepository.count(),
      this.accountRepository.findByPk(accountId, {
        attributes: ['id', 'name'],
      }),
    ]).pipe(
      map(([total, account]) => {
        this.emitter.emit(
          'slackNotification',
          new IncomingWebhook(
            this.configService.get('SLACK_WEBHOOK_URL_OF_NEW'),
          ),
          newMemberNotifyTemplate(total, account.getDataValue('name')),
        );
      }),
    );
  }

  public afterSignUp(account: AccountEntity, hashKey: number): void {
    this.subscriptions.push(this.signUpNotify(account.id).subscribe());
    this.subscriptions.push(
      (() => {
        if (account.email) {
          return this.sendVerifyEmail(account.email, hashKey);
        }
        if (account.phoneNumber) {
          return this.sendVerifyPhoneNumber(account.phoneNumber, hashKey);
        }
      })().subscribe(),
    );
  }

  public updateExistsAccountWhenSignUpByPhoneNumber(
    account: AccountEntity,
    name: string,
    phoneNumber: string,
    password: string,
  ): Observable<SignUpModel> {
    return from(
      account.update({
        name,
        phoneNumber,
        password: this.encryptedPassword(password),
        createdAt: new Date(),
      }),
    ).pipe(
      concatMap((account) => {
        return this.createVerifyHashKeyAndSave(account.id).pipe(
          tap(({ hashKey }) => this.afterSignUp(account, hashKey)),
          map(({ id, hashKeyPair, expiredAt }) => {
            return {
              verifyId: id,
              hashKeyPair,
              expiredAt,
            };
          }),
        );
      }),
    );
  }

  public updateExistsAccountWhenSignUpByEmail(
    account: AccountEntity,
    name: string,
    email: string,
    password: string,
  ): Observable<SignUpModel> {
    return from(
      account.update({
        name,
        email,
        password: this.encryptedPassword(password),
        createdAt: new Date(),
      }),
    ).pipe(
      concatMap((account) => {
        return this.createVerifyHashKeyAndSave(account.id).pipe(
          tap(({ hashKey }) => this.afterSignUp(account, hashKey)),
          map(({ id, hashKeyPair, expiredAt }) => {
            return {
              verifyId: id,
              hashKeyPair,
              expiredAt,
            };
          }),
        );
      }),
    );
  }

  public signUpByEmail(
    name: string,
    email: string,
    password: string,
  ): Observable<SignUpModel> {
    return from(
      this.accountRepository.create({
        name,
        email,
        password: this.encryptedPassword(password),
      }),
    ).pipe(
      concatMap((account) => {
        return this.createVerifyHashKeyAndSave(account.id).pipe(
          tap(({ hashKey }) => this.afterSignUp(account, hashKey)),
          map(({ id, hashKeyPair, expiredAt }) => {
            return {
              verifyId: id,
              hashKeyPair,
              expiredAt,
            };
          }),
        );
      }),
    );
  }

  public signUpByPhoneNumber(
    name: string,
    phoneNumber: string,
    password: string,
  ): Observable<SignUpModel> {
    return from(
      this.accountRepository.create({
        name,
        phoneNumber,
        password: this.encryptedPassword(password),
      }),
    ).pipe(
      concatMap((account) => {
        return this.createVerifyHashKeyAndSave(account.id).pipe(
          tap(({ hashKey }) => this.afterSignUp(account, hashKey)),
          map(({ id, hashKeyPair, expiredAt }) => {
            return {
              verifyId: id,
              hashKeyPair,
              expiredAt,
            };
          }),
        );
      }),
    );
  }
}

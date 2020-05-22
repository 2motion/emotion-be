import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
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

@Injectable()
export class AuthenticationService
  implements AuthenticationServiceInterface, OnModuleDestroy {
  public subscriptions: Subscription[] = [];

  public constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private readonly accountRepository: typeof AccountEntity,
    private readonly accountVerfiyRepository: typeof AccountVerfiyEntity,
    private readonly configService: ConfigService,
    @InjectEventEmitter() private readonly emitter: AppEventEmitter,
  ) {}

  public onModuleDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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
    return from(this.accountVerfiyRepository.create({ hashKey, accountId }));
  }

  public sendVerifyPhoneNumber(phoneNumber: string, verifyHash: number) {
    const smsClient = new SmsUtil(
      this.configService.get('AWS_ACCESS_KEY_ID'),
      this.configService.get('AWS_SECRET_ACCESS_KEY'),
    );
    const PNF = require('google-libphonenumber').PhoneNumberFormat;
    const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber, 'KR');

    return of(
      smsClient.send({
        Message: `[Gamstagram] 인증번호는 ${verifyHash} 입니다.`,
        MessageStructure: 'string',
        PhoneNumber: phoneUtil.format(number, PNF.E164),
      }),
    );
  }

  public sendVerifyEmail(accountEmailAddress: string, verifyHash: number) {
    const mailClient = new EmailUtil(
      this.configService.get('AWS_ACCESS_KEY_ID'),
      this.configService.get('AWS_SECRET_ACCESS_KEY'),
    );
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
    });

    return of(
      mailClient.send({
        Destination: {
          ToAddresses: [accountEmailAddress],
        },
        Message: {
          Body: {
            Text: {
              Data: '[]',
              Charset: 'utf-8',
            },
          },
          Subject: {
            Data: '',
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

  public afterSignUp(account: AccountEntity): void {
    this.subscriptions.push(this.signUpNotify(account.id).subscribe());
    this.subscriptions.push(
      this.createVerifyHashKeyAndSave(account.id).subscribe(),
    );
    this.subscriptions.push(
      this.createVerifyHashKeyAndSave(account.id)
        .pipe(
          concatMap(({ hashKey }) => {
            if (account.email) {
              return this.sendVerifyEmail(account.email, hashKey);
            }
            if (account.phoneNumber) {
              return this.sendVerifyPhoneNumber(account.phoneNumber, hashKey);
            }
          }),
        )
        .subscribe(),
    );
  }

  public signUpByEmail(
    name: string,
    email: string,
    password: string,
  ): Observable<number> {
    return from(
      this.accountRepository.create({
        name,
        email,
        password: this.encryptedPassword(password),
      }),
    ).pipe(
      tap((account) => this.afterSignUp(account)),
      pluck('id'),
    );
  }

  public signUpByPhoneNumber(
    name: string,
    phoneNumber: string,
    password: string,
  ): Observable<number> {
    return from(
      this.accountRepository.create({
        name,
        phoneNumber,
        password: this.encryptedPassword(password),
      }),
    ).pipe(
      tap((account) => this.afterSignUp(account)),
      pluck('id', 'email'),
    );
  }
}

import {
  Injectable,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { AccountEntity } from '@app/entities/account.entity';
import { from, Observable, Subscription, forkJoin } from 'rxjs';
import { pluck, tap, map } from 'rxjs/operators';
import AuthenticationServiceInterface from '@app/authentication/interfaces/authentication.service.interface';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InjectEventEmitter } from 'nest-emitter';
import { AppEventEmitter } from '@app/app.events';
import { IncomingWebhook } from '@slack/webhook';
import newMemberNotifyTemplate from '@app/shared/template/slack/new-member-notify.template';

@Injectable()
export class AuthenticationService
  implements AuthenticationServiceInterface, OnModuleDestroy {
  public subscriptions: Subscription[] = [];

  public constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private readonly accountRepository: typeof AccountEntity,
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
      pluck('id'),
      tap((accountId) =>
        this.subscriptions.push(this.signUpNotify(accountId).subscribe()),
      ),
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
      pluck('id'),
      tap((accountId) =>
        this.subscriptions.push(this.signUpNotify(accountId).subscribe()),
      ),
    );
  }
}

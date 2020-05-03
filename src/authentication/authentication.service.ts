import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { AccountEntity } from 'src/entities/account.entity';
import { from, Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import AuthenticationServiceInterface from './interfaces/authentication.service.interface';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InjectEventEmitter } from 'nest-emitter';
import { AppEventEmitter } from '@app/shared/event/app.event';

@Injectable()
export class AuthenticationService implements AuthenticationServiceInterface {
  public constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private readonly accountRepository: typeof AccountEntity,
    private readonly configService: ConfigService,
  ) {}

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
    phoneNumber: string,
    password: string,
  ): Observable<number> {
    return from(
      this.accountRepository.create({
        phoneNumber,
        password: this.encryptedPassword(password),
        createdAt: new Date(),
      }),
    ).pipe(pluck('id'));
  }

  public signUpByEmail(email: string, password: string): Observable<number> {
    return from(
      this.accountRepository.create({
        email,
        password: this.encryptedPassword(password),
        createdAt: new Date(),
      }),
    ).pipe(pluck('id'));
  }
}

import { Observable } from 'rxjs';
import { AccountEntity } from '@app/entities/account.entity';
import SignUpModel from '../model/sign-up.model';
import AccessTokenModel from '../model/access-token.model';

interface AuthenticationServiceInterface {
  findByPhoneNumber(phoneNumber: string): Observable<AccountEntity>;
  findByEmail(email: string): Observable<AccountEntity>;
  createAccessToken(account: AccountEntity): AccessTokenModel;
  encryptedPassword(password: string): string;
  findById(accountId: number): Observable<AccountEntity>;
  checkNameExists(name: string): Observable<number>;
  signUpByPhoneNumber(
    name: string,
    phoneNumber: string,
    password: string,
  ): Observable<SignUpModel>;
  signUpByEmail(
    name: string,
    email: string,
    password: string,
  ): Observable<SignUpModel>;
  verfiyPassword(password: string, encryptedPassword: string): boolean;
  updateExistsAccountWhenSignUpByPhoneNumber(
    account: AccountEntity,
    name: string,
    phoneNumber: string,
    password: string,
  ): Observable<SignUpModel>;
  updateExistsAccountWhenSignUpByEmail(
    account: AccountEntity,
    name: string,
    email: string,
    password: string,
  ): Observable<SignUpModel>;
}

export default AuthenticationServiceInterface;

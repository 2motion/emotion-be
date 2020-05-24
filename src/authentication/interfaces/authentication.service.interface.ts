import { Observable } from 'rxjs';
import { AccountEntity } from '@app/entities/account.entity';
import SignUpModel from '../model/sign-up.model';

interface AuthenticationServiceInterface {
  findByPhoneNumber(phoneNumber: string): Observable<AccountEntity>;
  findByEmail(email: string): Observable<AccountEntity>;
  createAccessToken(account: AccountEntity): string;
  encryptedPassword(password: string): string;
  findById(accountId: number): Observable<AccountEntity>;
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

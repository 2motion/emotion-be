import { Observable } from 'rxjs';
import { AccountEntity } from '@app/entities/account.entity';

interface AuthenticationServiceInterface {
  findByPhoneNumber(phoneNumber: string): Observable<AccountEntity>;
  findByEmail(email: string): Observable<AccountEntity>;
  createAccessToken(account: AccountEntity): string;
  encryptedPassword(password: string): string;
  signUpByPhoneNumber(
    name: string,
    phoneNumber: string,
    password: string,
  ): Observable<number>;
  findById(accountId: number): Observable<AccountEntity>;
  signUpByEmail(
    name: string,
    email: string,
    password: string,
  ): Observable<number>;
  verfiyPassword(password: string, encryptedPassword: string): boolean;
}

export default AuthenticationServiceInterface;

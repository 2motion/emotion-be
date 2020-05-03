import { Observable } from 'rxjs';
import { AccountEntity } from '@app/entities/account.entity';

interface AuthenticationServiceInterface {
  findByPhoneNumber(phoneNumber: string): Observable<AccountEntity>;
  findByEmail(email: string): Observable<AccountEntity>;
  createAccessToken(account: AccountEntity): string;
  encryptedPassword(password: string): string;
  signUpByPhoneNumber(
    phoneNumber: string,
    password: string,
  ): Observable<number>;
  signUpByEmail(email: string, password: string): Observable<number>;
  verfiyPassword(password: string, encryptedPassword: string): boolean;
}

export default AuthenticationServiceInterface;

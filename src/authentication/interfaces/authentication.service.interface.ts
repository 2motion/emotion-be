import CreateAccessTokenDto from '../dto/create-access-token.dto';
import { Observable } from 'rxjs';
import { AccountEntity } from '@app/entities/account.entity';

interface AuthenticationServiceInterface {
  findByPhoneNumber(phoneNumber: string): Observable<AccountEntity>;
  findByEmailNumber(email: string): Observable<AccountEntity>;
  createAccessToken(createAccessToken: CreateAccessTokenDto): string;
  encryptedPassword(password: string): string;
  signUpByPhoneNumber(
    phoneNumber: string,
    password: string,
  ): Observable<number>;
  signUpByEmail(email: string, password: string): Observable<number>;
}

export default AuthenticationServiceInterface;

import CreateAccessTokenDto from '../dto/create-access-token.dto';
import { Observable } from 'rxjs';

interface AuthenticationServiceInterface {
  createAccessToken(createAccessToken: CreateAccessTokenDto): string;
  encryptedPassword(password: string): string;
  signUpByPhoneNumber(
    phoneNumber: string,
    password: string,
  ): Observable<number>;
  signUpByEmail(email: string, password: string): Observable<number>;
}

export default AuthenticationServiceInterface;

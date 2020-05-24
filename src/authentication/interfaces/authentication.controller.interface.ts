import CreateAccessTokenDto from '../dto/create-access-token.dto';
import SignUpDto from '../dto/sign-up.dto';
import { Observable } from 'rxjs';
import SignUpModel from '../model/sign-up.model';

interface AuthenticationControllerInterface {
  createAccessToken(
    createAccessTokenDto: CreateAccessTokenDto,
  ): Observable<string>;
  signUp(signUpDto: SignUpDto): Observable<SignUpModel>;
  verify(verifyDto, ipAddress: string): Observable<void>;
}

export default AuthenticationControllerInterface;
``;

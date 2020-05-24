import CreateAccessTokenDto from '../dto/create-access-token.dto';
import SignUpDto from '../dto/sign-up.dto';
import { Observable } from 'rxjs';
import SignUpModel from '../model/sign-up.model';
import AccessTokenModel from '../model/access-token.model';

interface AuthenticationControllerInterface {
  createAccessToken(
    createAccessTokenDto: CreateAccessTokenDto,
  ): Observable<AccessTokenModel>;
  signUp(signUpDto: SignUpDto): Observable<SignUpModel>;
  verify(verifyDto, ipAddress: string): Observable<AccessTokenModel>;
}

export default AuthenticationControllerInterface;
``;

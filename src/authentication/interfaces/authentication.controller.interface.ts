import CreateAccessTokenDto from '../dto/create-access-token.dto';
import SignUpDto from '../dto/sign-up.dto';
import { Observable } from 'rxjs';

interface AuthenticationControllerInterface {
  createAccessToken(
    createAccessTokenDto: CreateAccessTokenDto,
  ): Observable<string>;
  signUp(signUpDto: SignUpDto): Observable<number>;
}

export default AuthenticationControllerInterface;
``;

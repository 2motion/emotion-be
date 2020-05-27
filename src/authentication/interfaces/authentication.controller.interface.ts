import CreateAccessTokenDto from '../dto/create-access-token.dto';
import SignUpDto from '../dto/sign-up.dto';
import { Observable } from 'rxjs';
import SignUpModel from '../model/sign-up.model';
import AccessTokenModel from '../model/access-token.model';
import VerifyDto from '../dto/verify.dto';
import ResendVerifyCodeDto from '../dto/resend-verify-code.dto';

interface AuthenticationControllerInterface {
  createAccessToken(
    createAccessTokenDto: CreateAccessTokenDto,
  ): Observable<AccessTokenModel>;
  signUp(signUpDto: SignUpDto): Observable<SignUpModel>;
  verify(verifyDto: VerifyDto, ipAddress: string): Observable<AccessTokenModel>;
  resendVerifyCode({
    verifyId,
    hashKeyPair,
  }: ResendVerifyCodeDto): Observable<void>;
}

export default AuthenticationControllerInterface;

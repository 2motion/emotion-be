import { Controller, Body, Post } from '@nestjs/common';
import SignUpDto from './dto/sign-up.dto';
import { AuthenticationService } from './authentication.service';
import CreateAccessTokenDto from './dto/create-access-token.dto';
import AuthenticationControllerInterface from './interfaces/authentication.controller.interface';
import { Observable } from 'rxjs';

@Controller('authentication')
export class AuthenticationController
  implements AuthenticationControllerInterface {
  public constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post('token')
  public createAccessToken(createAccessTokenDto: CreateAccessTokenDto): string {
    return this.authenticationService.createAccessToken(CreateAccessTokenDto);
  }

  @Post('sign-up')
  public signUp(@Body() signUpDto: SignUpDto): Observable<number> {
    if (signUpDto.email) {
      return this.authenticationService.signUpByEmail(
        signUpDto.email,
        signUpDto.password,
      );
    }
    return this.authenticationService.signUpByPhoneNumber(
      signUpDto.phoneNumber,
      signUpDto.password,
    );
  }
}

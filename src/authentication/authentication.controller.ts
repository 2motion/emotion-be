import { Controller, Body, Post, BadRequestException } from '@nestjs/common';
import SignUpDto from './dto/sign-up.dto';
import { AuthenticationService } from './authentication.service';
import CreateAccessTokenDto from './dto/create-access-token.dto';
import AuthenticationControllerInterface from './interfaces/authentication.controller.interface';
import { Observable } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';

@Controller('authentication')
export class AuthenticationController
  implements AuthenticationControllerInterface {
  public constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post('token')
  public createAccessToken(createAccessTokenDto: CreateAccessTokenDto): any {
    const account$ = (() => {
      if (createAccessTokenDto.email) {
        return this.authenticationService.findByEmail(
          createAccessTokenDto.email,
        );
      }
      return this.authenticationService.findByPhoneNumber(
        createAccessTokenDto.phoneNumber,
      );
    })();

    return account$.pipe(
      map(account => {
        if (!account) {
          throw new BadRequestException();
        }
        return account;
      }),
      concatMap(account => {
        return this.authenticationService.createAccessToken(account);
      }),
    );
  }

  @Post('sign-up')
  public signUp(@Body() signUpDto: SignUpDto): Observable<number> {
    const account$ = (() => {
      if (signUpDto.email) {
        return this.authenticationService.findByEmail(signUpDto.email);
      }
      return this.authenticationService.findByPhoneNumber(
        signUpDto.phoneNumber,
      );
    })();

    return account$.pipe(
      concatMap(account => {
        if (account) {
          throw new BadRequestException();
        }

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
      }),
    );
  }
}

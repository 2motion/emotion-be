import {
  Controller,
  Body,
  Post,
  BadRequestException,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  OnModuleDestroy,
} from '@nestjs/common';
import SignUpDto from './dto/sign-up.dto';
import { AuthenticationService } from './authentication.service';
import CreateAccessTokenDto from './dto/create-access-token.dto';
import AuthenticationControllerInterface from './interfaces/authentication.controller.interface';
import { Observable, of, Subscription } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import ArticleListModel from '@app/article/model/article-list.model';
import { CommonResponseReceiptDecorator } from '@app/shared/decorator/common-response-receipt.decorator';
import VerifyDto from './dto/verify.dto';
import { IpAddress } from '@app/shared/decorator/request-ip.decorator';
import SignUpModel from './model/sign-up.model';

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController
  implements AuthenticationControllerInterface, OnModuleDestroy {
  public readonly subscriptions: Subscription[] = [];
  public constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}

  public onModuleDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
  })
  @ApiOperation({ summary: 'Access token 을 생성한다.' })
  @CommonResponseReceiptDecorator()
  @Post('token')
  public createAccessToken(
    @Body() createAccessTokenDto: CreateAccessTokenDto,
  ): Observable<string> {
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
      map((account) => {
        if (!account) {
          throw new BadRequestException();
        }

        if (account.isPending) {
          throw new UnauthorizedException();
        }

        if (account.isBlock) {
          throw new BadRequestException(
            'Sorry, Your account has been blocked.',
          );
        }

        if (
          !this.authenticationService.verfiyPassword(
            createAccessTokenDto.password,
            account.password,
          )
        ) {
          this.subscriptions.push(
            this.authenticationService
              .saveLoginHistory(account.id, true)
              .subscribe(),
          );
          throw new BadRequestException();
        }

        this.subscriptions.push(
          this.authenticationService.saveLoginHistory(account.id).subscribe(),
        );
        return this.authenticationService.createAccessToken(account);
      }),
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
  })
  @ApiOperation({ summary: '계정 인증을 한다.' })
  @CommonResponseReceiptDecorator()
  @Post('verify')
  public verify(
    @Body() { verifyId, hashKey, hashKeyPair }: VerifyDto,
    @IpAddress() ipAddress: string,
  ): Observable<void> {
    return this.authenticationService.verify(verifyId, hashKey, hashKeyPair);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: SignUpModel,
  })
  @ApiOperation({ summary: '회원가입을 진행한다.' })
  @CommonResponseReceiptDecorator()
  @Post('sign-up')
  public signUp(
    @Body() { name, email, phoneNumber, password }: SignUpDto,
  ): Observable<SignUpModel> {
    if (!email && !phoneNumber) {
      throw new BadRequestException('이메일 또는 핸드폰 번호를 입력해주세요.');
    }

    const account$ = (() => {
      if (email) {
        return this.authenticationService.findByEmail(email);
      }
      return this.authenticationService.findByPhoneNumber(phoneNumber);
    })();

    return account$.pipe(
      concatMap((account) => {
        if (email && phoneNumber) {
          throw new BadRequestException(
            '이메일 또는 핸드폰 번호 둘 중 하나를 통해 가입해주세요.',
          );
        }

        if (account && !account.isPending) {
          throw new BadRequestException('Already exsists.');
        }

        if (account && account.isBlock) {
          throw new UnauthorizedException();
        }

        if (account && account.isPending) {
          return (() => {
            if (email) {
              return this.authenticationService.updateExistsAccountWhenSignUpByEmail(
                account,
                name,
                email,
                password,
              );
            }
            return this.authenticationService.updateExistsAccountWhenSignUpByPhoneNumber(
              account,
              name,
              phoneNumber,
              password,
            );
          })();
        }

        if (email) {
          return this.authenticationService.signUpByEmail(
            name,
            email,
            password,
          );
        }

        return this.authenticationService.signUpByPhoneNumber(
          name,
          phoneNumber,
          password,
        );
      }),
    );
  }
}

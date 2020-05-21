import {
  Controller,
  Body,
  Post,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import SignUpDto from './dto/sign-up.dto';
import { AuthenticationService } from './authentication.service';
import CreateAccessTokenDto from './dto/create-access-token.dto';
import AuthenticationControllerInterface from './interfaces/authentication.controller.interface';
import { Observable } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import ArticleListModel from '@app/article/model/article-list.model';
import { CommonResponseReceiptDecorator } from '@app/shared/decorator/common-response-receipt.decorator';

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController
  implements AuthenticationControllerInterface {
  public constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}

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
          throw new BadRequestException();
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
          throw new BadRequestException();
        }

        return this.authenticationService.createAccessToken(account);
      }),
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Number,
  })
  @ApiOperation({ summary: '회원가입을 진행한다.' })
  @CommonResponseReceiptDecorator()
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
      concatMap((account) => {
        if (account) {
          throw new BadRequestException();
        }

        if (signUpDto.email) {
          return this.authenticationService.signUpByEmail(
            signUpDto.name,
            signUpDto.email,
            signUpDto.password,
          );
        }

        return this.authenticationService.signUpByPhoneNumber(
          signUpDto.name,
          signUpDto.phoneNumber,
          signUpDto.password,
        );
      }),
    );
  }
}

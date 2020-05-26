import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Inject,
  Get,
} from '@nestjs/common';
import { CommonResponseReceiptDecorator } from '@app/shared/decorator/common-response-receipt.decorator';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '@app/base.controller';
import { AuthGuard } from '@app/shared/guard/auth.guard';
import { DecodedToken } from '@app/shared/decorator/decoded-token.decorator';
import JwtDecodedInterface from '@app/shared/interface/jwt-decoded.interface';
import { AccountEntity } from '@app/entities/account.entity';
import ProfileModel from './model/profile.model';
import { from, Observable } from 'rxjs';

@Controller('me')
export class MeController extends BaseController {
  public constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private readonly accountRepository: typeof AccountEntity,
  ) {
    super();
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
  })
  @ApiOperation({ summary: '나의 프로필 정보를 응답한다.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @CommonResponseReceiptDecorator()
  @Get()
  public getMyProfile(
    @DecodedToken() { accountId }: JwtDecodedInterface,
  ): Observable<ProfileModel> {
    return from(
      this.accountRepository.findByPk(accountId, {
        attributes: ['name'],
      }),
    );
  }
}

import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CommonResponseReceiptDecorator } from '@app/shared/decorator/common-response-receipt.decorator';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '@app/base.controller';
import { AuthGuard } from '@app/shared/guard/auth.guard';
import { DecodedToken } from '@app/shared/decorator/decoded-token.decorator';
import JwtDecodedInterface from '@app/shared/interface/jwt-decoded.interface';
import ProfileModel from './model/profile.model';
import { Observable } from 'rxjs';
import { MeService } from './me.service';

@Controller('me')
export class MeController extends BaseController {
  public constructor(private readonly meService: MeService) {
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
    return this.meService.getProfileById(accountId);
  }
}

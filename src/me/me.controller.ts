import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Post,
  Body,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { CommonResponseReceiptDecorator } from '@app/shared/decorator/common-response-receipt.decorator';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { BaseController } from '@app/base.controller';
import { AuthGuard } from '@app/shared/guard/auth.guard';
import { DecodedToken } from '@app/shared/decorator/decoded-token.decorator';
import JwtDecodedInterface from '@app/shared/interface/jwt-decoded.interface';
import ProfileModel from './model/profile.model';
import { Observable } from 'rxjs';
import { MeService } from './me.service';
import UpdateProfileDto from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as mimeType from 'mime-types';

@ApiTags('me')
@Controller('me')
export class MeController extends BaseController {
  public constructor(private readonly meService: MeService) {
    super();
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProfileModel,
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

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProfileModel,
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '나의 프로필 정보를 업데이트한다.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('avatarImage', {
      fileFilter: (_req: Request, file, cb) => {
        const extension = mimeType.extension(file.mimetype) as string;

        console.log('extension', extension);

        if (!['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
          return cb(new BadRequestException(), false);
        }

        return cb(null, true);
      },
    }),
  )
  @CommonResponseReceiptDecorator()
  @Post()
  public updateMyProfile(
    @DecodedToken() { accountId }: JwtDecodedInterface,
    @UploadedFile() avatarImage: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.meService.updateProfile(accountId, {
      ...updateProfileDto,
      ...{ avatarImage },
    });
  }
}

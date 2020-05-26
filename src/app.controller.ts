import { Get, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { ApiOperation } from '@nestjs/swagger';
import { BaseController } from './base.controller';

@Controller()
export class AppController extends BaseController {
  public constructor() {
    super();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '서버 시간을 응답한다.' })
  @Get('time')
  public serverTime(): Observable<{ serverTime: number }> {
    return of({ serverTime: Date.now() });
  }
}

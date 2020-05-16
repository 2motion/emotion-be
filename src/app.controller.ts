import { Get, Controller } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Controller()
export class AppController {
  @Get('time')
  public serverTime(): Observable<number> {
    return of(Date.now());
  }
}

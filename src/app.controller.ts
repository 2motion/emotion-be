import { Get, Controller } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Controller()
export class AppController {
  @Get('time')
  public serverTime(): Observable<{ serverTime: number }> {
    return of({ serverTime: Date.now() });
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import JwtDecodedInterface from '../interface/jwt-decoded.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly configService: ConfigService) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const accessToken = request.headers.authorization.substring(
      7,
      request.headers.authorization.length,
    );
    const decoded = jwt.verify(
      accessToken,
      this.configService.get<string>('ACCESS_TOKEN_PRIVATE_KEY'),
    );

    if (!decoded) {
      throw new UnauthorizedException();
    }

    request['decodedToken'] = decoded as JwtDecodedInterface;
    return true;
  }
}

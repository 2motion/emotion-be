import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { authenticationProvider } from './authentication.provider';
import { ConfigModule } from '@nestjs/config';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, NestEmitterModule.forRoot(new EventEmitter())],
      providers: [AuthenticationService, ...authenticationProvider],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

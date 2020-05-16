import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationService } from './authentication.service';
import { authenticationProvider } from './authentication.provider';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';

describe('Authentication Controller', () => {
  let controller: AuthenticationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, NestEmitterModule.forRoot(new EventEmitter())],
      controllers: [AuthenticationController],
      providers: [AuthenticationService, ...authenticationProvider],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

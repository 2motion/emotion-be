import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationService } from './authentication.service';
import { authenticationProvider } from './authentication.provider';

describe('Authentication Controller', () => {
  let controller: AuthenticationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [AuthenticationController],
      providers: [AuthenticationService, ...authenticationProvider],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

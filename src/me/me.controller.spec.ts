import { Test, TestingModule } from '@nestjs/testing';
import { MeController } from './me.controller';
import { authenticationProvider } from '@app/authentication/authentication.provider';
import { MeService } from './me.service';
import { ConfigModule } from '@nestjs/config';

describe('Me Controller', () => {
  let controller: MeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [MeController],
      providers: [MeService, ...authenticationProvider],
    }).compile();

    controller = module.get<MeController>(MeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

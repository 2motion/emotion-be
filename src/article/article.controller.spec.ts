import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from '@app/article/article.controller';
import { ArticleService } from '@app/article/article.service';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { articleProviders } from '@app/article/article.provider';
import { authenticationProvider } from '@app/authentication/authentication.provider';
import { ConfigModule } from '@nestjs/config';
import { CanActivate } from '@nestjs/common';
import { AuthGuard } from '@app/shared/guard/auth.guard';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';

describe('Article Controller', () => {
  let controller: ArticleController;

  beforeEach(async () => {
    const mockAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, NestEmitterModule.forRoot(new EventEmitter())],
      controllers: [ArticleController],
      providers: [
        ArticleService,
        AuthenticationService,
        ...articleProviders,
        ...authenticationProvider,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<ArticleController>(ArticleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { articleProviders } from './article.provider';
import { authenticationProvider } from '@app/authentication/authentication.provider';
import { ConfigModule } from '@nestjs/config';
import { CanActivate } from '@nestjs/common';
import { AuthGuard } from '@app/shared/guard/auth.guard';

describe('Article Controller', () => {
  let controller: ArticleController;

  beforeEach(async () => {
    const mockAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
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

import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { articleProviders } from './article.provider';
import { authenticationProvider } from '@app/authentication/authentication.provider';
import { ConfigModule } from '@nestjs/config';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';

describe('ArticleService', () => {
  let service: ArticleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, NestEmitterModule.forRoot(new EventEmitter())],
      providers: [
        ArticleService,
        AuthenticationService,
        ...articleProviders,
        ...authenticationProvider,
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

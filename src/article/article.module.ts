import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { databaseProviders } from '../shared/provider/database.provider';
import { articleProviders } from './article.provider';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { authenticationProvider } from '@app/authentication/authentication.provider';

@Module({
  imports: [ConfigModule],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    AuthenticationService,
    ...articleProviders,
    ...authenticationProvider,
    ...databaseProviders,
  ],
})
export class ArticleModule {}

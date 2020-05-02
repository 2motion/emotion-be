import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { databaseProviders } from '../shared/providers/database.provider';
import { articleProviders } from './article.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [ArticleController],
  providers: [ArticleService, ...articleProviders, ...databaseProviders],
})
export class ArticleModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [ArticleModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

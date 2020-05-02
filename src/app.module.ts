import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [ArticleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

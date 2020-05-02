import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [ConfigModule.forRoot(), ArticleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [ConfigModule.forRoot(), ArticleModule, AuthenticationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

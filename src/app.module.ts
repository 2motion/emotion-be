import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ArticleModule,
    AuthenticationModule,
    NestEmitterModule.forRoot(new EventEmitter()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RavenModule, RavenInterceptor } from 'nest-raven';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ArticleModule,
    AuthenticationModule,
    NestEmitterModule.forRoot(new EventEmitter()),
    RavenModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor(),
    },
  ],
})
export class AppModule {}

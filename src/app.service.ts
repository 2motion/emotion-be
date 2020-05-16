import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { AppEventEmitter } from './app.events';

@Injectable()
export class AppService implements OnModuleInit {
  public constructor(
    @InjectEventEmitter() private readonly emitter: AppEventEmitter,
  ) {}

  public onModuleInit(): void {
    this.emitter.on('slackNotification', async (webhook, template) => {
      console.log('@@fuck');
      await webhook.send(template);
    });
  }
}

import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';
import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';

abstract class AppEvents {
  public readonly slackNotification: (
    webhook: IncomingWebhook,
    template: IncomingWebhookSendArguments,
  ) => Promise<void>;
}

export type AppEventEmitter = StrictEventEmitter<EventEmitter, AppEvents>;

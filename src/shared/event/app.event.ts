import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';
import { AccountEntity } from '@app/entities/account.entity';

interface AppEvent {
  createAccessToken: (account: AccountEntity) => string;
}

export type AppEventEmitter = StrictEventEmitter<EventEmitter, AppEvent>;

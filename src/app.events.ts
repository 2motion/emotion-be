import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';

abstract class AppEvents {}

export type AppEventEmitter = StrictEventEmitter<EventEmitter, AppEvents>;

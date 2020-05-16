import { bootstrapServer } from 'src';
import * as Sentry from '@sentry/node';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await bootstrapServer();

  Sentry.init({ dsn: process.env.SENTRY_DSN });

  app.listen(3000);
}
bootstrap();

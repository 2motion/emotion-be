import { bootstrapServer } from 'src';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await bootstrapServer();

  Sentry.init({
    dsn: 'https://<key>@<organization>.ingest.sentry.io/<project>',
  });

  app.listen(3000);
}
bootstrap();

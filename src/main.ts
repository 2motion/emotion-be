import { bootstrapServer } from 'src';

async function bootstrap() {
  const app = await bootstrapServer();
  app.listen(3000);
}
bootstrap();

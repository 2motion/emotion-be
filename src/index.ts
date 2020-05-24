import 'reflect-metadata';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';
import * as dotenv from 'dotenv';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import * as requestIp from 'request-ip';
import swaggerBootstrap from '@app/bootstrap/swagger.bootstrap';
import { eventContext } from 'aws-serverless-express/middleware';

let cachedServer: Server;

export const bootstrapServer = async (): Promise<Server> => {
  dotenv.config();

  Sentry.init({ dsn: process.env.SENTRY_DSN });

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);

  app.enableCors();
  app.use(eventContext());
  app.use(helmet());
  app.use(compression());
  app.use(requestIp.mw());
  app.useGlobalPipes(new ValidationPipe());

  swaggerBootstrap(app);

  await app.init();
  return awsServerlessExpress.createServer(expressApp);
};

export const handler: APIGatewayProxyHandler = async (
  event,
  context,
  callback,
) => {
  if (event['source'] === 'serverless-plugin-warmup') {
    console.log('WarmUp - Lambda is warm!');
    return callback(null);
  }
  if (event.path === '/swagger') {
    event.path = '/swagger/';
  }
  console.log('proccess env', process.env);
  if (!cachedServer) {
    const server = await bootstrapServer();
    cachedServer = server;
    return awsServerlessExpress.proxy(server, event, context, 'PROMISE')
      .promise;
  } else {
    return awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE')
      .promise;
  }
};

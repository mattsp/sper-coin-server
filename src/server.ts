import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

import { ApplicationModule } from './modules/app.module';
import { CONFIG } from './environment'
import { NestFactory } from '@nestjs/core';

// import  Database  from './database'


async function bootstrap() {
  const instance = express();
  instance.use(bodyParser.urlencoded({ extended: true }));
  instance.use(bodyParser.json());
  instance.use(cors());
  // Database.connect();
  const app = await NestFactory.create(ApplicationModule, instance);
  await app.listen(CONFIG.PORT, '0.0.0.0', () => console.log(`Application is listening on port ${CONFIG.PORT}`));
}
bootstrap();

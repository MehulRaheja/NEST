import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  ////////////// REMOVING BOTH VALIDATION PIPE AND COOKIE SESSION, BECAUSE THEY ARE USED AS GLOBAL PIPE AND MIDDLEWARE IN THE APP.MODULE
  // app.use(cookieSession({
  //   keys: ['sfasfasdfasfas']
  // }));
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // true means it will remove all the additional fields which we are not expecting. Hence make our body more secure.
  //   })
  // );
  await app.listen(3001);
}
bootstrap();

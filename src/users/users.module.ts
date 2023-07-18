import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

// // commented code is related to interceptor ("CurrentUserInterceptor"), but we are no longer using it.
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
// import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // this will create a repository for us.
  controllers: [UsersController],
  providers: [
    UsersService, 
    AuthService, 
    // { // using APP_INTERCEPTOR to use CurrentUserInterceptor globally for all controllers inside users directory
    //   // so, there is no need to import interceptors in each controller individually
    //   // this approach will work for all controllers but some controllers don't need this interceptor but it will still
    //   // fetch data including for them also from database, this overfetching is a downside of this approach.
    //   provide: APP_INTERCEPTOR,
    //   useClass: CurrentUserInterceptor
    // }
  ]
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*'); // "*" because we want to use it for all the routes
  }
}

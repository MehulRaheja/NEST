import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/users.entity';
import { Report } from './reports/reports.entity';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      // we are specifying Config module once and want to use it globally in the entire project.  
      // it specifies which env file will be used according to the environment
      isGlobal: true, 
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true,
        }
      }
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   // One way of selecting db dynamically
    //   // database: process.env.NODE_ENV === 'test' 
    //   // ? 'test.sqlite' : 'db.sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true, // true means if we make changes in our entity it will synchronize with the database at startup, means migration will be done automatically
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ////////////// THIS IS HOW WE SET A GLOBAL PIPE  //////////////////////
    { // this provide and useValue method means bind this value to all the incoming requests
      provide: APP_PIPE,
      useValue: new ValidationPipe({ 
        whitelist: true, // true means it will remove all the additional fields which we are not expecting. Hence make our body more secure.
      })
    }
  ],
})
export class AppModule {
  /// APPLYING COOKIE SESSION AS A GLOBAL MIDDLEWARE
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply( cookieSession({
        keys: ['sfasfasdfasfas']
      }),
    )
    .forRoutes('*'); // This means use this global middleware for all the routes
  }
};

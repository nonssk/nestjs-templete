import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BackGroundModule } from './background';
import { RequestMiddleware } from './middlewares/request.middleware';
import { ExpressMiddleware } from './middlewares/express.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimalModule } from './modules/animal';
import { ProjectModule } from './modules/project';
import { StoreModule } from './tools/store/store.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/httpException.filter';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_HOST || '', {
      dbName: process.env.DATABASE_NAME || '',
      user: process.env.DATABASE_USER || '',
      pass: process.env.DATABASE_PASS || '',
    }),
    BackGroundModule,
    AnimalModule,
    ProjectModule,
    StoreModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExpressMiddleware).forRoutes('*');
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}

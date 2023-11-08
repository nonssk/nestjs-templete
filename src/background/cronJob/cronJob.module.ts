import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { WriterJob } from './jobs/writer.job';
import { StoreService } from '../../tools/store/store.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CronJobLog, CronJobLogSchema } from '../../schemas/cronJobLog.schema';
import { User, UserSchema } from '../../schemas/user.schema';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: CronJobLog.name, schema: CronJobLogSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [WriterJob, StoreService],
})
export class CronJobModule {}

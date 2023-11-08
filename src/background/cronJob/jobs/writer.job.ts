import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronJobLog } from '../../../schemas/cronJobLog.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoreService } from '../../../tools/store/store.service';

@Injectable()
export class WriterJob {
  private readonly logger = new Logger(WriterJob.name);

  constructor(
    @InjectModel(CronJobLog.name) private cronJobLog: Model<CronJobLog>,
    private readonly storeService: StoreService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async cronProcess() {
    if (!process.env.JOB_PROCESS) return;
    const doc = await this.cronJobLog
      .find({ cronName: process.env.JOB_PROCESS || '' })
      .exec();
    if (doc.length === 0) {
      this.logger.warn(`Empty CronJob`);
      return;
    }
    const ids = [];
    for (const d of doc) {
      ids.push(d._id);
      this.logger.log(`Process ID:${d._id}`);
    }
    await this.cronJobLog.deleteMany({ _id: { $in: ids } }).exec();
  }

  @Cron('*/1 * * * * *')
  async cronProvider() {
    if (!process.env.JOB_PROVIDER) return;
    const doc = await this.cronJobLog.create({
      cronName: process.env.JOB_PROVIDER,
      date: new Date(),
    });
    if (!doc) {
      this.logger.warn(`Unable to create CronJob`);
      return;
    }
    this.logger.log(`Public ID:${doc._id}`);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async cronReadStoreFiles() {
    if (process.env.USE_CRON_FILE !== 'true') return;
    this.storeService.processFile();
  }
}

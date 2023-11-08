import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<CronJobLog>;

@Schema({ collection: 'cronJobLogs' })
export class CronJobLog {
  @Prop()
  public cronName!: string;
  @Prop()
  public date!: Date;
}

export const CronJobLogSchema = SchemaFactory.createForClass(CronJobLog);

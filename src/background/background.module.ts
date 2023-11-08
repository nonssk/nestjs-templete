import { Module } from '@nestjs/common';
import { CronJobModule } from './cronJob';

@Module({
  imports: [CronJobModule],
})
export class BackGroundModule {}

import { Module } from '@nestjs/common';
import { CronJobModule } from './cronJob';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [CronJobModule, KafkaModule],
})
export class BackGroundModule {}

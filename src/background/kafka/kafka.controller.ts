import { Controller, Get, HttpStatus, OnModuleInit, Res } from '@nestjs/common';
import { Response } from 'express';
import { KafkaService } from './kafka.service';

@Controller('kafka')
export class KafkaController implements OnModuleInit {
  constructor(private kafkaService: KafkaService) {}
  async onModuleInit() {
    this.kafkaService.initKafka();
    await this.kafkaService.initProducer();
    await this.kafkaService.initConsumer(
      [`${process.env.KAFKA_TOPIC_USER}`],
      `${process.env.KAFKA_GROUP_ID}`,
    );
  }

  @Get('user')
  async send(@Res() res: Response) {
    this.kafkaService.sendMessage(process.env.KAFKA_TOPIC_USER);
    return res.status(HttpStatus.OK).respond('XXX-XX-XXXX', 'ok');
  }
}

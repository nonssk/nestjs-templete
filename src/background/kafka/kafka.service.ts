import { Injectable, Logger } from '@nestjs/common';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name);
  private client: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  initKafka(): void {
    this.client = new Kafka({
      clientId: process.env.KAFKA_CLIECT_ID,
      brokers: [`${process.env.KAFKA_BROKER_1}`],
    });
  }

  async initProducer(): Promise<void> {
    try {
      this.producer = this.client.producer();
      await this.producer.connect();
    } catch (error) {
      this.logger.error(`Unable to initKafkaProducer`);
    }
  }

  async initConsumer(topics: string[], groupId: string): Promise<void> {
    try {
      this.consumer = this.client.consumer({
        groupId,
        allowAutoTopicCreation: true,
        readUncommitted: true,
      });
      await this.consumer.connect();
      await this.consumer.subscribe({
        topics: topics,
      });
      await this.consumer.run({
        autoCommit: false,
        eachMessage: async (data) => this.reciveMessage(data),
      });
    } catch (error) {
      this.logger.error(`Unable to initKafkaProducer`);
    }
  }

  async sendMessage(topic: string) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: 'MESSAGE!' }],
      });
    } catch (error) {
      this.logger.error(`Unable to sendMessage`);
    }
  }

  async reciveMessage(data: EachMessagePayload): Promise<void> {
    const { topic, message } = data;
    this.logger.log(`TOPIC:${topic} MESSAGE:${message.value.toString()}`);
  }
}

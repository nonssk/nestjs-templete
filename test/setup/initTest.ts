import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function init(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app: INestApplication = moduleFixture.createNestApplication();
  return await app.init();
}

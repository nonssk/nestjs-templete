import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { init } from './setup/initTest';

describe('AppController API', () => {
  let app: INestApplication;
  beforeEach(async () => {
    app = await init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

describe('AnimalController API', () => {
  let app: INestApplication;
  beforeEach(async () => {
    app = await init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/animals')
      .expect(200)
      .expect(['cat', 'dog']);
  });
});

describe('ProjectController API', () => {
  let app: INestApplication;
  beforeEach(async () => {
    app = await init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/projects')
      .expect(200)
      .expect(['cat', 'dog']);
  });
});

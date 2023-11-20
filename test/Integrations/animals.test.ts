import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { init } from '../setup/initTest';

describe.skip('Animals api test', () => {
  let app: INestApplication;
  beforeEach(async () => {
    app = await init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/animals')
      .expect(200)
      .expect({ code: 'XXX-XX-XXXX', msg: 'ok', data: ['cat', 'dog'] });
  });
});

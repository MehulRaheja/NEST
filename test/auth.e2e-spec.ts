import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Handles a signup request', async () => {
    const email = 'testgg@example.com'
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({email, password: 'test'})
      .expect(201)
      .then((res) => {
        const {id, email} = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      })
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'testgg@example.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({email, password: 'sdjkfl'})
      .expect(201)
    // by default cookie doesn't get saved so we are storing it in a variable because it is required for the 
    // next request where we are getting currently logged in user
    const cookie = res.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie) // here cookie is being set inside headers of the http request
      .expect(200)

    expect(body.email).toEqual(email);
  });
});

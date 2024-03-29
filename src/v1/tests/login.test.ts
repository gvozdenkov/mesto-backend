/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { assert } from 'chai';
import request from 'supertest';
import { config } from '#config';
import { app } from '#app';
import { tokenService } from '#services';
import { message } from '#messages';
import { User } from '#user';
import { basePathV1 } from '#v1';
import { extractCookies } from '#utils';
import { setupTestDB, testUserOne } from './utils';

var { secret } = config.jwt;

var loginPath = `${basePathV1}/signin`;

setupTestDB();

describe('Auth service', () => {
  describe('Login user', () => {
    beforeEach((done) => {
      User.create(testUserOne).then(() => done());
    });
    it('Should signin if email exists and password correct', async () => {
      var { name, about, avatar, email, password } = testUserOne;

      await request(app)
        .post(loginPath)
        .send({ email, password })
        .expect(200)
        .expect('Content-type', /json/)
        .then((res) => {
          var { status, data } = res.body;

          var cookies = extractCookies(res.headers);
          var { accessToken } = cookies;
          var token = tokenService.verify(accessToken.value, secret);

          assert.equal(status, 'success');
          assert.include(data, { name, about, avatar, email });
          assert.notProperty(data, 'password');
          assert.strictEqual(data._id, token._id);
        });
    });
    it('Should not signin with a non-existent email or incorrect password', async () => {
      var { email, password } = testUserOne;
      var wrongEmail = 'wrong@mail.com';
      var wrongPassword = 'wrong-password';

      await request(app)
        .post(loginPath)
        .send({ email: wrongEmail, password })
        .expect(401)
        .expect('Content-type', /json/)
        .then((res) => {
          assert.deepStrictEqual(res.body, {
            status: 'fail',
            message: message.invalidEmailOrPwd(),
          });
        });

      await request(app)
        .post(loginPath)
        .send({ email, password: wrongPassword })
        .expect(401)
        .expect('Content-type', /json/)
        .then((res) => {
          assert.deepStrictEqual(res.body, {
            status: 'fail',
            message: message.invalidEmailOrPwd(),
          });
        });
    });
  });
});

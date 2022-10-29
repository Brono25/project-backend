
import { AuthRegistorReturn } from '../data.types';
import * as h from './test.helper';

beforeEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

describe('clearV1()', () => {
  test('Adding duplicate user after clearV1 should succeed if clear works', () => {
    let data = h.postRequest(h.REGISTER_URL, {
      email: h.email1,
      password: h.password1,
      nameFirst: h.firstName1,
      nameLast: h.lastName1,
    });
    expect(data).toStrictEqual(<AuthRegistorReturn>{
      authUserId: expect.any(Number),
      token: expect.any(String),
    });

    h.deleteRequest(h.CLEAR_URL, {});

    data = h.postRequest(h.REGISTER_URL, {
      email: h.email1,
      password: h.password1,
      nameFirst: h.firstName1,
      nameLast: h.lastName1,
    });
    expect(data).toStrictEqual(<AuthRegistorReturn>{
      authUserId: expect.any(Number),
      token: expect.any(String),
    });
  });
});

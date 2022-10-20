
import { UserProfileReturn } from '../data.types';
import * as h from './test.helper';

// Setup

let authUserId0: any;
let authUserToken: string;

beforeEach(() => {
  authUserId0 = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  authUserToken = authUserId0.token;
  authUserId0 = parseInt(authUserId0.authUserId);
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Incorrect uId', () => {
    const data = h.getRequest(h.USER_PROF_URL, {
      token: authUserId0.token,
      uId: Math.abs(authUserId0.uId) + 10,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Invalid token', () => {
    const data = h.getRequest(h.USER_PROF_URL, {
      token: 'invalidToken',
      uId: authUserId0.uId,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Valid token and uId', () => {
    const data = h.getRequest(h.USER_PROF_URL, {
      token: authUserToken,
      uId: authUserId0,
    });

    expect(data).toStrictEqual(<UserProfileReturn>{
      user: {
        uId: authUserId0,
        email: h.email0,
        nameFirst: h.firstName0,
        nameLast: h.lastName0,
        handleStr: expect.any(String),
      }
    });
  });
});

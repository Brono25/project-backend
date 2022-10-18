
import { UserProfileReturn } from '../data.types';
import * as h from './test.helper';

// Setup: Create 3 users.

let authUserId0: any;
let authUserId2: any;
beforeEach(() => {
  authUserId0 = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  authUserId0 = parseInt(authUserId0.authUserId);
  h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  authUserId2 = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  authUserId2 = parseInt(authUserId2.authUserId);
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
    const data = h.postRequest(h.LOGIN_URL, {
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
      token: authUserId0.token,
      uId: authUserId0.uId,
    });

    expect(data).toStrictEqual(<UserProfileReturn>{ 
      user: {
        uId: authUserId0.uId,
        email: h.email0,
        nameFirst: h.firstName0,
        nameLast: h.lastName0,
        handleStr: expect.any(String),
      }
    });
  });
});

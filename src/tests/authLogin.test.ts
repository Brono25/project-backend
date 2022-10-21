
import { AuthLoginReturn } from '../data.types';
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
  test('Incorrect email', () => {
    const data = h.postRequest(h.LOGIN_URL, {
      email: h.wrongEmail,
      password: h.password0,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Incorrect password', () => {
    const data = h.postRequest(h.LOGIN_URL, {
      email: h.email0,
      password: h.wrongPassword,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Authorise login for first user in database', () => {
    const data = h.postRequest(h.LOGIN_URL, {
      email: h.email0,
      password: h.password0,
    });
    expect(data).toStrictEqual(<AuthLoginReturn>{
      authUserId: authUserId0,
      token: expect.any(String),
    });
  });
  test('Authorise login for last user in database', () => {
    const data = h.postRequest(h.LOGIN_URL, {
      email: h.email2,
      password: h.password2,
    });
    expect(data).toStrictEqual(<AuthLoginReturn>{
      authUserId: authUserId2,
      token: expect.any(String),
    });
  });
  test('Authorise Login using upper case email matching lowercase', () => {
    const data = h.postRequest(h.LOGIN_URL, {
      email: h.email0AltCase,
      password: h.password0,
    });
    expect(data).toStrictEqual(<AuthLoginReturn>{
      authUserId: authUserId0,
      token: expect.any(String),
    });
  });
});


import { AuthLoginReturn } from '../data.types';
import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup: Create 3 users.
let authUserId0: any;
let authUserId2: any;
beforeEach(() => {
  const data = h.generateUserRegisterArgs(0);
  authUserId0 = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  authUserId0 = parseInt(authUserId0.authUserId);
  h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  authUserId2 = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  authUserId2 = parseInt(authUserId2.authUserId);
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Incorrect email', () => {
    const user0Login = {
      email: h.wrongEmail,
      password: h.password0
    };
    h.testErrorThrown(h.LOGIN_URL, 'POST', 400, user0Login);
  });
  test('Incorrect password', () => {
    const user0Login = {
      email: h.email0,
      password: h.wrongPassword
    };
    h.testErrorThrown(h.LOGIN_URL, 'POST', 400, user0Login);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Authorise login for first user in database', () => {
    const data = h.postRequest(h.LOGIN_URL, h.generateUserLoginArgs(0));
    expect(data).toStrictEqual(<AuthLoginReturn>{
      authUserId: authUserId0,
      token: expect.any(String),
    });
  });
  test('Authorise login for last user in database', () => {
    const data = h.postRequest(h.LOGIN_URL, h.generateUserLoginArgs(2));
    expect(data).toStrictEqual(<AuthLoginReturn>{
      authUserId: authUserId2,
      token: expect.any(String),
    });
  });
  test('Authorise Login using upper case email matching lowercase', () => {
    const data = h.postRequest(h.LOGIN_URL, {
      email: h.email0AltCase,
      password: h.password,
    });
    expect(data).toStrictEqual(<AuthLoginReturn>{
      authUserId: authUserId0,
      token: expect.any(String),
    });
  });
  test('Login twice with the same user', () => {
    let data = h.postRequest(h.LOGIN_URL, h.generateUserLoginArgs(0));
    expect(data).toStrictEqual(<AuthLoginReturn>{
      authUserId: authUserId0,
      token: expect.any(String),
    });
    data = h.postRequest(h.LOGIN_URL, h.generateUserLoginArgs(0));
    expect(data).toStrictEqual(<AuthLoginReturn>{
      authUserId: authUserId0,
      token: expect.any(String),
    });
  });
});

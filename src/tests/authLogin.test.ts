
import {
  authRegisterV1,
  authLoginV1,
} from '../auth';

import { clearV1 } from '../other';
import { AuthLoginReturn } from '../data.types';
import * as h from './test.helper';


// Setup
let authUserId0: number;
let authUserId2: number;
beforeEach(() => {
  // user 0
  let args: h.Args = [h.email0, h.password0, h.firstName0, h.lastName0];
  authUserId0 = h.authRegisterReturnGaurd(authRegisterV1(...args));
  // user 1
  args = [h.email1, h.password1, h.firstName1, h.lastName1];
  authRegisterV1(...args);
  // user 2
  args = [h.email2, h.password2, h.firstName2, h.lastName2];
  authUserId2 = h.authRegisterReturnGaurd(authRegisterV1(...args));
});

// Tear down
afterEach(() => {
  clearV1();
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Incorrect  email', () => {
    expect(authLoginV1(h.wrongEmail, h.password0)).toStrictEqual({ error: expect.any(String) });
  });
  test('Incorrect password', () => {
    expect(authLoginV1(h.email0, h.wrongPassword)).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Authorise login for first user in database', () => {
    expect(authLoginV1(h.email0, h.password0)).toStrictEqual(<AuthLoginReturn>{
      authUserId: authUserId0,
      token: expect.any(String),
    });
  });
  test('Authorise login for last user in database', () => {
    expect(authLoginV1(h.email2, h.password2)).toStrictEqual(<AuthLoginReturn>{
      token: expect.any(String),
      authUserId: authUserId2,
    });
  });
  test('Authorise Login using upper case email matching lowercase', () => {
    expect(authLoginV1(h.email0AltCase, h.password0)).toStrictEqual(<AuthLoginReturn>{ 
      authUserId: authUserId0,
      token: expect.any(String),
    });
  });
});

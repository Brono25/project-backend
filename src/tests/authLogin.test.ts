
import {
  authRegisterV1,
  authLoginV1,
} from '../auth';

import { clearV1 } from '../other';

// Test data
const firstName1 = 'First Name 1';
const lastName1 = 'Last Name 1';
const email1 = 'email_1@gmail.com';
const email1AltCase = 'EMAIL_1@GMAIL.COM';
const password1 = 'password1';

const firstName2 = 'First Name 2';
const lastName2 = 'Last Name 2';
const email2 = 'email_2@gmail.com';
const password2 = 'password2';

const wrongEmail = 'anything@gmail.com';
const wrongPassword = 'wrongpassword';

type Args1 = [string, string, string, string];
type Args2 = [string, string];

// Setup

let userId1 = null;
let userId3 = null;
beforeEach(() => {
  // create database of 3 users
  let args: Args1 = [email1, password1, firstName1, lastName1];
  userId1 = authRegisterV1(...args).authUserId;
  args = ['middleUser'.concat(email1), password1, firstName1, lastName2];
  authRegisterV1(...args);
  args = [email2, password2, firstName2, lastName2];
  userId3 = authRegisterV1(...args).authUserId;
});

// Tear down
afterEach(() => { clearV1(); });

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Incorrect  email', () => {
    expect(authLoginV1(wrongEmail, password1)).toStrictEqual({ error: expect.any(String) });
  });
  test('Incorrect password', () => {
    expect(authLoginV1(email1, wrongPassword)).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Authorise login for first user in database', () => {
    const args: Args2 = [email1, password1];
    expect(authLoginV1(...args)).toStrictEqual({ authUserId: userId1 });
  });
  test('Authorise login for last user in database', () => {
    const args: Args2 = [email2, password2];
    expect(authLoginV1(...args)).toStrictEqual({ authUserId: userId3 });
  });
  test('Authorise Login using upper case email matching lowercase', () => {
    expect(authLoginV1(email1AltCase, password1)).toStrictEqual({ authUserId: userId1 });
  });
});

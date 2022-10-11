
import {
  authRegisterV1,
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

const invalidEmail = 'Not a valid email string';
const invalidShortPassword = '12345';
const invalidEmptyName = '';
const invalidLongFirstName = 'FirstNameLongerThanFiftyCharactersIsAnInvalidFirstName';
const invalidLongLastName = 'LastNameLongerThanFiftyCharactersIsAnInvalidLastName';

type Args = [string, string, string, string];

// Tear down
afterEach(() => { clearV1(); });

// ------------------Test------------------//

describe('Error Handling', () => {
  test('Invalid email', () => {
    const args: Args = [invalidEmail, password1, firstName1, lastName1];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
  test('Email address already in use', () => {
    const args1: Args = [email1, password1, firstName1, lastName1];
    const args2: Args = [email1, password2, firstName2, lastName2];
    authRegisterV1(...args1);
    expect(authRegisterV1(...args2)).toStrictEqual({ error: expect.any(String) });
  });
  test('Attempt to assign uppercase email when lower case email is already taken', () => {
    const args1: Args = [email1, password1, firstName1, lastName1];
    authRegisterV1(...args1);
    const args2: Args = [email1AltCase, password2, firstName2, lastName2];
    expect(authRegisterV1(...args2)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid password (less than 6 characters)', () => {
    const args: Args = [email1, invalidShortPassword, firstName1, lastName1];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid first name (greater than 50 characters)', () => {
    const args: Args = [email1, password1, invalidLongFirstName, lastName1];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid last name (greater than 50 characters)', () => {
    const args: Args = [email1, password1, firstName1, invalidLongLastName];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
  test('Invalid empty first name', () => {
    const args: Args = [email1, password1, invalidEmptyName, lastName1];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
  test('Invalid empty last name', () => {
    const args: Args = [email1, password1, firstName1, invalidEmptyName];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Function Testing', () => {
  test('Create new user and get a number user ID', () => {
    const args: Args = [email2, password2, firstName2, lastName2];
    expect(authRegisterV1(...args)).toStrictEqual({ authUserId: expect.any(Number) });
  });
  test('Create new user with existing names and password but different email', () => {
    const args: Args = [email2, password1, firstName1, lastName1];
    expect(authRegisterV1(...args)).toStrictEqual({ authUserId: expect.any(Number) });
  });
  test('Create 100 users and get 100 unique ID\'s', () => {
    const numberOfUsers = 100;
    const userIdList = new Set();
    let email = '';
    for (let n = 0; n < numberOfUsers; n++) {
      email = n.toString().concat(email1);
      const args: Args = [email, password1, firstName1, lastName1];
      const userId = authRegisterV1(...args);
      userIdList.add(userId);
    }
    expect(userIdList.size === numberOfUsers).toStrictEqual(true);
  });
});

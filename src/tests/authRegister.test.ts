
import {
  authRegisterV1,
} from '../auth';

import { clearV1 } from '../other';

import * as h from './helper.test';

// Tear down
afterEach(() => {
  clearV1();
});

// ------------------Test------------------//

describe('Error Handling', () => {
  test('Invalid email', () => {
    const args: h.AuthRegisterArgs = [h.invalidEmail, h.password0, h.firstName0, h.lastName0];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
  test('Email address already in use', () => {
    const args0: h.AuthRegisterArgs = [h.email0, h.password0, h.firstName0, h.lastName0];
    const args1: h.AuthRegisterArgs = [h.email0, h.password1, h.firstName1, h.lastName1];
    authRegisterV1(...args0);
    expect(authRegisterV1(...args1)).toStrictEqual({ error: expect.any(String) });
  });
  test('Attempt to assign uppercase email when lower case email is already taken', () => {
    const args0: h.AuthRegisterArgs = [h.email0, h.password0, h.firstName0, h.lastName0];
    authRegisterV1(...args0);
    const args1: h.AuthRegisterArgs = [h.email0AltCase, h.password1, h.firstName1, h.lastName1];
    expect(authRegisterV1(...args1)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid password (less than 6 characters)', () => {
    const args: h.AuthRegisterArgs = [h.email0, h.invalidShortPassword, h.firstName0, h.lastName0];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid first name (greater than 50 characters)', () => {
    const args: h.AuthRegisterArgs = [h.email0, h.password0, h.invalidLongFirstName, h.lastName0];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid last name (greater than 50 characters)', () => {
    const args: h.AuthRegisterArgs = [h.email0, h.password0, h.firstName0, h.invalidLongLastName];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
  test('Invalid empty first name', () => {
    const args: h.AuthRegisterArgs = [h.email0, h.password0, h.invalidEmptyName, h.lastName0];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
  test('Invalid empty last name', () => {
    const args: h.AuthRegisterArgs = [h.email0, h.password0, h.firstName0, h.invalidEmptyName];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Function Testing', () => {
  test('Create new user and get a number user ID', () => {
    const args: h.AuthRegisterArgs = [h.email0, h.password0, h.firstName0, h.lastName0];
    expect(authRegisterV1(...args)).toStrictEqual({ authUserId: expect.any(Number) });
  });
  test('Create new user with existing names and password but different email', () => {
    const args0: h.AuthRegisterArgs = [h.email0, h.password0, h.firstName0, h.lastName0];
    authRegisterV1(...args0);
    const args1: h.AuthRegisterArgs = [h.email1, h.password0, h.firstName0, h.lastName0];
    expect(authRegisterV1(...args1)).toStrictEqual({ authUserId: expect.any(Number) });
  });
  test('Create 100 users and get 100 unique ID\'s', () => {
    const numberOfUsers = 100;
    const userIdList = new Set();
    let email = '';
    for (let n = 0; n < numberOfUsers; n++) {
      email = n.toString().concat(h.email0);
      const args: h.AuthRegisterArgs = [email, h.password0, h.firstName0, h.lastName0];
      const userId = authRegisterV1(...args);
      userIdList.add(userId);
    }
    expect(userIdList.size === numberOfUsers).toStrictEqual(true);
  });
});

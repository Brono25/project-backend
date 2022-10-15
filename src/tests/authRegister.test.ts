
import {
  authRegisterV1,
} from '../auth';
import { AuthRegistorReturn } from '../data.types';
import * as h from './test.helper';

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Test------------------//

describe('Error Handling', () => {
  test('Invalid email', () => {
    const data = h.postRequest(h.REGISTER_URL, {
      email: h.invalidEmail,
      password: h.password0,
      nameFirst: h.firstName0,
      nameLast: h.lastName0,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Email address already in use', () => {
    const args0: h.Args = [h.email0, h.password0, h.firstName0, h.lastName0];
    const args1: h.Args = [h.email0, h.password1, h.firstName1, h.lastName1];
    authRegisterV1(...args0);
    expect(authRegisterV1(...args1)).toStrictEqual({ error: expect.any(String) });
  });
  test('Attempt to assign uppercase email when lower case email is already taken', () => {
    const args0: h.Args = [h.email0, h.password0, h.firstName0, h.lastName0];
    authRegisterV1(...args0);
    const args1: h.Args = [h.email0AltCase, h.password1, h.firstName1, h.lastName1];
    expect(authRegisterV1(...args1)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid password (less than 6 characters)', () => {
    const args: h.Args = [h.email0, h.invalidShortPassword, h.firstName0, h.lastName0];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid first name (greater than 50 characters)', () => {
    const args: h.Args = [h.email0, h.password0, h.invalidLongFirstName, h.lastName0];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid last name (greater than 50 characters)', () => {
    const args: h.Args = [h.email0, h.password0, h.firstName0, h.invalidLongLastName];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
  test('Invalid empty first name', () => {
    const args: h.Args = [h.email0, h.password0, h.invalidEmptyName, h.lastName0];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
  test('Invalid empty last name', () => {
    const args: h.Args = [h.email0, h.password0, h.firstName0, h.invalidEmptyName];
    expect(authRegisterV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Function Testing', () => {
  test('Create new user and get a number user ID and token', () => {
    const args: h.Args = [h.email0, h.password0, h.firstName0, h.lastName0];
    expect(authRegisterV1(...args)).toStrictEqual(<AuthRegistorReturn>{
      authUserId: expect.any(Number),
      token: expect.any(String),
    });
  });
  test('Create new user with existing names and password but different email', () => {
    const args0: h.Args = [h.email0, h.password0, h.firstName0, h.lastName0];
    authRegisterV1(...args0);
    const args1: h.Args = [h.email1, h.password0, h.firstName0, h.lastName0];
    expect(authRegisterV1(...args1)).toStrictEqual(<AuthRegistorReturn>{
      authUserId: expect.any(Number),
      token: expect.any(String),
    });
  });
  test('Create 100 users and get 100 unique ID\'s', () => {
    const numberOfUsers = 100;
    const userIdList = new Set();
    let email = '';
    for (let n = 0; n < numberOfUsers; n++) {
      email = n.toString().concat(h.email0);
      const args: h.Args = [email, h.password0, h.firstName0, h.lastName0];
      const userId = authRegisterV1(...args);
      userIdList.add(userId);
    }
    expect(userIdList.size === numberOfUsers).toStrictEqual(true);
  });
});

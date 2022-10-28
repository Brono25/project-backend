
import { AuthRegistorReturn } from '../data.types';
import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
beforeEach(() => {
  h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Test------------------//

describe('Error Handling', () => {
  test('Invalid email', () => {
    const data = h.postRequest(h.REGISTER_URL, {
      email: h.invalidEmail,
      password: h.password1,
      nameFirst: h.firstName1,
      nameLast: h.lastName1,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Email address already in use', () => {
    const data = h.postRequest(h.REGISTER_URL, {
      email: h.email0,
      password: h.password1,
      nameFirst: h.firstName1,
      nameLast: h.lastName1,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Attempt to assign uppercase email when lower case email is already taken', () => {
    const data = h.postRequest(h.REGISTER_URL, {
      email: h.email0AltCase,
      password: h.password1,
      nameFirst: h.firstName1,
      nameLast: h.lastName1,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid password (less than 6 characters)', () => {
    const data = h.postRequest(h.REGISTER_URL, {
      email: h.email1,
      password: h.invalidShortPassword,
      nameFirst: h.firstName1,
      nameLast: h.lastName1,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid first name (greater than 50 characters)', () => {
    const data = h.postRequest(h.REGISTER_URL, {
      email: h.email1,
      password: h.password1,
      nameFirst: h.invalidLongFirstName,
      nameLast: h.lastName1,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid last name (greater than 50 characters)', () => {
    const data = h.postRequest(h.REGISTER_URL, {
      email: h.email1,
      password: h.password1,
      nameFirst: h.firstName1,
      nameLast: h.invalidLongLastName,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Invalid empty first name', () => {
    const data = h.postRequest(h.REGISTER_URL, {
      email: h.email1,
      password: h.password1,
      nameFirst: h.invalidEmptyName,
      nameLast: h.lastName1,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Invalid empty last name', () => {
    const data = h.postRequest(h.REGISTER_URL, {
      email: h.email1,
      password: h.password1,
      nameFirst: h.firstName1,
      nameLast: h.invalidEmptyName,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Function Testing', () => {
  test('Create new user and get a number user ID and token', () => {
    const data = h.postRequest(h.REGISTER_URL, {
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
  test('Create new user with existing names and password but different email', () => {
    const data = h.postRequest(h.REGISTER_URL, {
      email: h.email1,
      password: h.password0,
      nameFirst: h.firstName0,
      nameLast: h.lastName0,
    });
    expect(data).toStrictEqual(<AuthRegistorReturn>{
      authUserId: expect.any(Number),
      token: expect.any(String),
    });
  });
  test('Create 100 users and get 100 unique ID\'s', () => {
    const numberOfUsers = 100;
    const userIdList = new Set();
    let email = '';
    for (let n = 0; n < numberOfUsers; n++) {
      email = n.toString().concat(h.email2);
      const data = h.postRequest(h.REGISTER_URL, {
        email: email,
        password: h.password0,
        nameFirst: h.firstName0,
        nameLast: h.lastName0,
      });

      userIdList.add(data);
    }
    expect(userIdList.size === numberOfUsers).toStrictEqual(true);
  });
});

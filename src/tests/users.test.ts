
import {
  authRegisterV1,
} from '../auth';

import { userProfileV1 } from '../users';
import { clearV1 } from '../other';

// Test data
const firstName1 = 'First Name 1';
const lastName1 = 'Last Name 1';
const email1 = 'email_1@gmail.com';
const password1 = 'password1';

const firstName2 = 'First Name 2';
const lastName2 = 'Last Name 2';
const email2 = 'email_2@gmail.com';
const password2 = 'password2';

type Args = [string, string, string, string];

// ------------------Auth Register Test------------------//

describe('userProfileV1', () => {
  // Setup
  let user1 = null;
  let wrongUserId = null;
  beforeEach(() => {
    user1 = authRegisterV1(email1, password1, firstName1, lastName1);
    wrongUserId = user1.authUserId + 10;
  });
  // Tear down
  afterEach(() => { clearV1(); });

  describe('Error Handling', () => {
    test('Invalid authUserId', () => {
      expect(userProfileV1(wrongUserId, user1.authUserId)).toStrictEqual({ error: expect.any(String) });
    });
    test('Invalid uId', () => {
      expect(userProfileV1(user1.authUserId, wrongUserId)).toStrictEqual({ error: expect.any(String) });
    });
  });
});

describe('Function Testing', () => {
  let user1 = null;
  beforeEach(() => {
    user1 = authRegisterV1(email1, password1, firstName1, lastName1);
  });
  // Tear down
  afterEach(() => { clearV1(); });

  test('Valid authUserId and uId', () => {
    const args2: Args = [email2, password2, firstName2, lastName2];
    const authUserId2 = authRegisterV1(...args2).authUserId;

    expect(userProfileV1(user1.authUserId, authUserId2)).toStrictEqual({
      user: {
        uId: authUserId2,
        email: email2,
        nameFirst: firstName2,
        nameLast: lastName2,
        handleString: expect.any(String),
      }
    });
  });
});

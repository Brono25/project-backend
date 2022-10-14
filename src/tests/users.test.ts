
import { authRegisterV1 } from '../auth';

import { userProfileV1 } from '../users';
import { clearV1 } from '../other';
import * as h from './test.helper';

// ------------------Auth Register Test------------------//

// Setup
let userId0: number;
let invalidUserId: number;
beforeEach(() => {
  const args: h.Args = [h.email0, h.password0, h.firstName0, h.lastName0];
  userId0 = h.authRegisterReturnGaurd(authRegisterV1(...args));
  invalidUserId = Math.abs(userId0) + 10;
});
// Tear down
afterEach(() => {
  clearV1();
});

describe('Error Handling', () => {
  test('Invalid authUserId', () => {
    expect(userProfileV1(invalidUserId, userId0)).toStrictEqual({ error: expect.any(String) });
  });
  test('Invalid uId', () => {
    expect(userProfileV1(userId0, invalidUserId)).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Function Testing', () => {
  test('Valid authUserId and uId', () => {
    const args: h.Args = [h.email1, h.password1, h.firstName1, h.lastName1];
    const userId1 = h.authRegisterReturnGaurd(authRegisterV1(...args));

    expect(userProfileV1(userId0, userId1)).toStrictEqual({
      user: {
        uId: userId1,
        email: h.email1,
        nameFirst: h.firstName1,
        nameLast: h.lastName1,
        handleString: expect.any(String),
      }
    });
  });
});

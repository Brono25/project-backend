
import { UserProfileReturn } from '../data.types';
import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
let uId0: number;
let token0: string;
let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Incorrect uId', () => {
    const data = { uId: Math.abs(uId0) + 10 };
    h.testErrorThrown(h.USER_PROF_URL, 'GET', 400, data, token0);
  });
  test('Invalid token', () => {
    const data = { uId: uId0 };
    h.testErrorThrown(h.USER_PROF_URL, 'GET', 403, data, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Valid token and uId', () => {
    const data = h.getRequest(h.USER_PROF_URL, { uId: uId0 }, token0);

    expect(data).toStrictEqual(<UserProfileReturn>{
      user: {
        uId: uId0,
        email: h.email0,
        nameFirst: h.firstName0,
        nameLast: h.lastName0,
        handleStr: expect.any(String),
      }
    });
  });
});

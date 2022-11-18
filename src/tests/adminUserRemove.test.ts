
import * as h from './test.helper';
// Setup
let token0: string;
let uId0: number;

let invalidUserId: number;

let tmp: any;

beforeEach(() => {
  // tokens 0,1 and 2
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid token', () => {
    h.testErrorThrown(h.ADMIN_USER_RMV_URL, 'DELETE', 403, uId0, h.invalidToken);
  });
  test('Invalid uId', () => {
    h.testErrorThrown(h.ADMIN_USER_RMV_URL, 'DELETE', 400, invalidUserId, token0);
  });
  test('Only global owner', () => {
    h.testErrorThrown(h.ADMIN_USER_RMV_URL, 'DELETE', 400, uId0, token0);
  });
});
// ------------------Function Testing------------------//

import HTTPError from 'http-errors';
import * as h from './test.helper';
// Setup
let token0: string;
let token1 : string;
let token2 : string;
let uId0: number;
let uId1: number;
let uId2: number;

let invalidUserId: number;

let channelId0: number;
let channelId1: number;
let channelId2: number;
let invalidChannelId: number;

let tmp: any;

beforeEach(() => {
  // tokens 0,1 and 2
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = tmp.token;
  uId2 = parseInt(tmp.authUserId);
  

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
  test('Auth user not global owner', () => {
    h.testErrorThrown(h.ADMIN_USER_RMV_URL, 'DELETE', 400, uId0, token1);
  });
});
// ------------------Function Testing------------------//

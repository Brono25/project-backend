
import * as h from './test.helper';

// Setup
let token0: string;
let token1 : string;
let token2 : string;
let uId0: number;
let uId1: number;
let uId2: number;

let channelId0: number;
let channelId1: number;
let channelId2: number;

let dmId0: number;
let tmp: any;

beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = tmp.token;
  uId2 = parseInt(tmp.authUserId);

  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token1);
  channelId0 = parseInt(tmp.channelId);
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(1, false), token1);
  channelId1 = parseInt(tmp.channelId);
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(2, true), token2);
  channelId2 = parseInt(tmp.channelId);

  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId1, uId2] }, token0);
  dmId0 = parseInt(tmp.dmId);

  h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId0 }, token0);
  h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId0 }, token2);
  h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId2 }, token0);
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid token', () => {
    h.testErrorThrown(h.USER_STATS, 'GET', 403, undefined, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('A', () => {

  });
});

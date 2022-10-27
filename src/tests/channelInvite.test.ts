
import { clearV1 } from '../other';
import * as h from './test.helper';
h.deleteRequest(h.CLEAR_URL, {});

// Setup
let tmp: any;
let uId0: number;
let uId1: number;
let invalidUId: number;

let token0: string;
let token1: string;

let channelId0: number;
let invalidChannelId: number;

beforeEach(() => {
  // uIds and tokens 0 and 1
  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  uId0 = parseInt(tmp.authUserId);
  token0 = tmp.token;

  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  uId1 = parseInt(tmp.authUserId);
  token1 = tmp.token;

  // Channel 0
  tmp = h.postRequest(h.CHAN_CREATE_URL, {
    token: token0,
    name: h.channelName0,
    isPublic: h.isPublic,
  });
  channelId0 = parseInt(tmp.channelId);

  // error inputs
  invalidChannelId = Math.abs(channelId0) + 10;
  invalidUId = Math.abs(uId0) + 10;
});

// Tear down
afterEach(() => {
  clearV1();
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//
describe('Error Handling', () => {
  test('Invalid channel Id', () => {
    const data = h.postRequest(h.CHAN_INV_URL, {
      token: token0,
      channelId: invalidChannelId,
      uId: uId0,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid User Id', () => {
    const data = h.postRequest(h.CHAN_INV_URL, {
      token: token0,
      channelId: channelId0,
      uId: invalidUId,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('User already member of channel', () => {
    const data = h.postRequest(h.CHAN_INV_URL, {
      token: token0,
      channelId: channelId0,
      uId: uId0,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('authUser not a member', () => {
    const data = h.postRequest(h.CHAN_INV_URL, {
      token: token1,
      channelId: channelId0,
      uId: uId1,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid token', () => {
    const data = h.postRequest(h.CHAN_INV_URL, {
      token: 'invalidToken',
      channelId: channelId0,
      uId: uId1,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('adds the user to the channel', () => {
    const data = h.postRequest(h.CHAN_INV_URL, {
      token: token0,
      channelId: channelId0,
      uId: uId1,
    });
    expect(data).toStrictEqual({});
  });
});

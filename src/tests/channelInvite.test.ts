
import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
let tmp: any;
let uId0: number;
let uId1: number;
let invalidUId: number;
let token0: string;
let channelId0: number;
let invalidChannelId: number;

beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  uId0 = parseInt(tmp.authUserId);
  token0 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  uId1 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
  channelId0 = parseInt(tmp.channelId);
  invalidChannelId = Math.abs(channelId0) + 10;
  invalidUId = Math.abs(uId0) + 10;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//
describe('Error Handling', () => {
  test('Invalid channel Id', () => {
    const data = {
      channelId: invalidChannelId,
      uId: uId0,
    };
    h.testErrorThrown(h.CHAN_INV_URL, 'POST', 400, data, token0);
  });

  test('Invalid User Id', () => {
    const data = {
      channelId: channelId0,
      uId: invalidUId,
    };
    h.testErrorThrown(h.CHAN_INV_URL, 'POST', 400, data, token0);
  });

  test('User already member of channel', () => {
    const data = {
      channelId: channelId0,
      uId: uId0,
    };
    h.testErrorThrown(h.CHAN_INV_URL, 'POST', 400, data, token0);
  });

  test('authUser not a member', () => {
    tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
    const token2 = tmp.token;
    const data = {
      channelId: channelId0,
      uId: uId1,
    };
    h.testErrorThrown(h.CHAN_INV_URL, 'POST', 403, data, token2);
  });

  test('Invalid token', () => {
    const data = {
      channelId: channelId0,
      uId: uId1,
    };
    h.testErrorThrown(h.CHAN_INV_URL, 'POST', 403, data, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('adds the user to the channel', () => {
    let data: any = h.postRequest(h.CHAN_INV_URL, {
      channelId: channelId0,
      uId: uId1,
    }, token0);
    expect(data).toStrictEqual({});
    data = h.getRequest(h.CHAN_DETAIL_URL, {
      channelId: channelId0,
    }, token0);
    expect(data.allMembers.some((a: any) => a.uId === uId1)).toStrictEqual(true);
  });
});

import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let token1 : string;
let token2 : string;

let channelId0: number;
let invalidChannelId: number;

let tmp: any;

beforeEach(() => {
  // tokens 0,1 and 2
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = tmp.token;
  // error inputs
  invalidChannelId = Math.abs(channelId0) + 10;
  // Channels 0 and private
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
  channelId0 = parseInt(tmp.channelId);

  // add user1
  tmp = h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId0 }, token1);
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//
describe('Error Handling', () => {
  test('Invalid Channel ID', () => {
    const data = {
      channelId: invalidChannelId,
    };
    h.testErrorThrown(h.CHAN_LEAVE_URL, 'POST', 400, data, token0);
  });

  test('User is not a member of channel', () => {
    const data = {
      channelId: channelId0,
    };
    h.testErrorThrown(h.CHAN_LEAVE_URL, 'POST', 403, data, token2);
  });

  test('Invalid token', () => {
    const data = { channelId: channelId0 };
    h.testErrorThrown(h.CHAN_LEAVE_URL, 'POST', 403, data, h.invalidToken);
  });
});

// ------------------Function Testing------------------//
// test with channelDetails when it is completed

describe('Function Testing', () => {
  test('channel owner leaves the channel', () => {
    const a: any = h.getRequest(h.CHAN_DETAIL_URL, {
      channelId: channelId0
    }, token0);
    const data = h.postRequest(h.CHAN_LEAVE_URL, {
      channelId: channelId0,
    }, token0);

    expect(data).toStrictEqual({});
    const b: any = h.getRequest(h.CHAN_DETAIL_URL, {
      channelId: channelId0,
    }, token1);
    expect(b.ownerMembers.length === a.ownerMembers.length - 1).toStrictEqual(true);
  });

  test('channel member leaves the channel', () => {
    const a: any = h.getRequest(h.CHAN_DETAIL_URL, {
      channelId: channelId0
    }, token1);
    const data = h.postRequest(h.CHAN_LEAVE_URL, {
      channelId: channelId0,
    }, token1);
    expect(data).toStrictEqual({});
    const b: any = h.getRequest(h.CHAN_DETAIL_URL, {
      channelId: channelId0,
    }, token0);
    expect(b.allMembers.length === a.allMembers.length - 1).toStrictEqual(true);
  });

  test('all members leaves the channel', () => {
    let data = h.postRequest(h.CHAN_LEAVE_URL, {
      channelId: channelId0,
    }, token0);
    data = h.postRequest(h.CHAN_LEAVE_URL, {
      channelId: channelId0,
    }, token1);
    expect(data).toStrictEqual({});
  });
});

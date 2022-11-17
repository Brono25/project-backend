import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let token1 : string;
let uId1: number;
let mId0: number;
let mId1: number;
let invalidMId: number;
let invalidChannelId: number;
let invalidDmId: number;
let channelId0: number;
let channelId1: number;
let dmId1: number;
let dmId0: number;
let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
  channelId0 = parseInt(tmp.channelId);
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token1);
  channelId1 = parseInt(tmp.channelId);
  invalidChannelId = Math.abs(channelId0 + 10);
  tmp = h.postRequest(h.MSG_SEND_URL, { channelId: channelId0, message: h.message0 }, token0);
  mId0 = parseInt(tmp.messageId);
  invalidMId = Math.abs(mId0 + 10);
  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId1] }, token0);
  dmId0 = parseInt(tmp.dmId);
  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [] }, token1);
  dmId1 = parseInt(tmp.dmId);
  tmp = h.postRequest(h.MSG_SEND_DM_URL, { dmId: dmId0, message: h.message1 }, token1);
  mId1 = parseInt(tmp.messageId);
  invalidDmId = Math.abs(dmId0 + 10);
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------///
describe('Error Handling', () => {
  test('Invalid token', () => {
    const data = {
      ogMessageId: mId0,
      message: 'message',
      channelId: -1,
      dmId: dmId0
    };
    h.testErrorThrown(h.MSG_SHARE_URL, 'POST', 403, data, h.invalidToken);
  });
  test('Invalid message ID', () => {
    const data = {
      ogMessageId: invalidMId,
      message: 'message',
      channelId: -1,
      dmId: dmId0
    };
    h.testErrorThrown(h.MSG_SHARE_URL, 'POST', 400, data, token1);
  });
  test('Both channelId and dmId are valid', () => {
    const data = {
      ogMessageId: mId0,
      message: 'message',
      channelId: -1,
      dmId: -1
    };
    h.testErrorThrown(h.MSG_SHARE_URL, 'POST', 400, data, token1);
  });
  test('Message length is too long (over 1000 characters)', () => {
    const data = {
      ogMessageId: mId0,
      message: h.invalidLongMessage,
      channelId: -1,
      dmId: dmId0
    };
    h.testErrorThrown(h.MSG_SHARE_URL, 'POST', 400, data, token1);
  });
  test('DmId is invalid', () => {
    const data = {
      ogMessageId: mId0,
      message: 'message',
      channelId: -1,
      dmId: invalidDmId
    };
    h.testErrorThrown(h.MSG_SHARE_URL, 'POST', 400, data, token1);
  });
  test('ChannelId is invalid', () => {
    const data = {
      ogMessageId: mId0,
      message: 'message',
      channelId: invalidChannelId,
      dmId: -1,
    };
    h.testErrorThrown(h.MSG_SHARE_URL, 'POST', 400, data, token1);
  });
  test('User is not a member of DM to share the message', () => {
    const data = {
      ogMessageId: mId0,
      message: 'message',
      channelId: -1,
      dmId: dmId1
    };
    h.testErrorThrown(h.MSG_SHARE_URL, 'POST', 403, data, token0);
  });
  test('User is not a member of channel to share the message', () => {
    const data = {
      ogMessageId: mId0,
      message: 'message',
      channelId: channelId1,
      dmId: -1
    };
    h.testErrorThrown(h.MSG_SHARE_URL, 'POST', 403, data, token0);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('share message from channel0 to channel1', () => {
    const a = h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId0 }, token1);
    expect(a).toStrictEqual({});
    const data = {
      ogMessageId: mId0,
      message: 'message',
      channelId: channelId1,
      dmId: -1
    };
    const b: any = h.postRequest(h.MSG_SHARE_URL, data, token1);
    expect(b).toStrictEqual({ newMessageId: parseInt(b.newMessageId) });
  });
  test('share message from channel0 to dm0', () => {
    const data = {
      ogMessageId: mId0,
      message: 'message',
      channelId: -1,
      dmId: dmId0
    };
    const a: any = h.postRequest(h.MSG_SHARE_URL, data, token0);
    expect(a).toStrictEqual({ newMessageId: parseInt(a.newMessageId) });
  });
  test('share message from dm0 to dm1', () => {
    const data = {
      ogMessageId: mId1,
      message: 'message',
      channelId: -1,
      dmId: dmId1
    };
    const a: any = h.postRequest(h.MSG_SHARE_URL, data, token1);
    expect(a).toStrictEqual({ newMessageId: parseInt(a.newMessageId) });
  });
  test('share message from dm0 to channel0', () => {
    const data = {
      ogMessageId: mId1,
      message: 'message',
      channelId: channelId0,
      dmId: -1
    };
    const a: any = h.postRequest(h.MSG_SHARE_URL, data, token0);
    expect(a).toStrictEqual({ newMessageId: parseInt(a.newMessageId) });
  });
});

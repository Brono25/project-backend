import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let token1 : string;
let token2: string;
let tmp: any;
let mId0: number;
let mId1: number;
let mId2: number;
let mId3: number;
let mId4: number;
let invalidMId: number;
let channelId0: number;
let channelId1: number;
beforeEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = tmp.token;

  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
  channelId0 = parseInt(tmp.channelId);
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(1, true), token1);
  channelId1 = parseInt(tmp.channelId);

  h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId1 }, token0);
  h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId0 }, token1);
  h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId1 }, token2);

  tmp = h.postRequest(h.MSG_SEND_URL, { channelId: channelId0, message: h.message0 }, token0);
  mId0 = parseInt(tmp.messageId);
  tmp = h.postRequest(h.MSG_SEND_URL, { channelId: channelId0, message: h.message1 }, token1);
  mId1 = parseInt(tmp.messageId);
  tmp = h.postRequest(h.MSG_SEND_URL, { channelId: channelId1, message: h.message2 }, token2);
  mId2 = parseInt(tmp.messageId);
  tmp = h.postRequest(h.MSG_SEND_URL, { channelId: channelId1, message: h.message3 }, token1);
  mId3 = parseInt(tmp.messageId);
  tmp = h.postRequest(h.MSG_SEND_URL, { channelId: channelId1, message: h.message4 }, token0);
  mId4 = parseInt(tmp.messageId);

  invalidMId = Math.abs(mId0 + mId1 + mId2 + mId3 + mId4);
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//
describe('Error Handling', () => {
  test('invalid token', () => {
    const data = { messageId: mId0 };
    h.testErrorThrown(h.MSG_RMV_URL, 'DELETE', 403, data, h.invalidToken);
  });
  test('invalid message Id', () => {
    const data = { messageId: invalidMId };
    h.testErrorThrown(h.MSG_RMV_URL, 'DELETE', 400, data, token0);
  });
  test('User is not part of the channel that the message was posted in', () => {
    const data = { messageId: mId4 };
    h.testErrorThrown(h.MSG_RMV_URL, 'DELETE', 403, data, token2);
  });
  test('Member try to delete message they didnt post', () => {
    const data = { messageId: mId1 };
    h.testErrorThrown(h.MSG_RMV_URL, 'DELETE', 403, data, token2);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Member deletes own message', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      messageId: mId2,
    }, token2);
    expect(data).toStrictEqual({});
  });
  test('Owner deletes own message', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      messageId: mId0,
    }, token0);
    expect(data).toStrictEqual({});
  });
  test('Owner (not global owner) deletes members message', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      messageId: mId2,
    }, token1);
    expect(data).toStrictEqual({});
  });
  test('Owner (global owner) deletes members message', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      messageId: mId1,
    }, token1);
    expect(data).toStrictEqual({});
    const ret: any = h.getRequest(h.CHAN_MSG_URL, { channelId: channelId0, start: 0 }, token0);
    expect(ret.messages.some((a: any) => a.message === h.message1)).toStrictEqual(false);
    expect(ret.messages.some((a: any) => a.message === h.message0)).toStrictEqual(true);
  });
  test('Member but global owner deletes members message', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      messageId: mId3,
    }, token0);
    expect(data).toStrictEqual({});
    const ret: any = h.getRequest(h.CHAN_MSG_URL, { channelId: channelId1, start: 1 }, token0);
    expect(ret.messages.some((a: any) => a.message === h.message3)).toStrictEqual(false);
  });
  test('Member but global owner deletes own message', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      messageId: mId4,
    }, token0);
    expect(data).toStrictEqual({});
    const ret: any = h.getRequest(h.CHAN_MSG_URL, { channelId: channelId1, start: 0 }, token1);
    expect(ret.messages.some((a: any) => a.message === h.message4)).toStrictEqual(false);
    expect(ret.messages.some((a: any) => a.message === h.message3)).toStrictEqual(true);
    expect(ret.messages.some((a: any) => a.message === h.message2)).toStrictEqual(true);
  });
});

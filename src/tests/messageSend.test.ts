import * as h from './test.helper';
import {
  MessageId,
} from '../data.types';

h.deleteRequest(h.CLEAR_URL, {});

const invChanId = 'Invalid channel ID';
const invMessage = 'Invalid message length';
const nonMember = 'Only members can message on the channel';
const invToken = 'Invalid token';

// Setup
let token0: string;
let token1: string;
let channelId0: number;
let invalidChannelId: number;
beforeEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
  let tmp: any = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  parseInt(tmp.authUserId);
  token0 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  parseInt(tmp.authUserId);
  token1 = tmp.token;

  tmp = h.postRequest(h.CHAN_CREATE_URL, {
    token: token0,
    name: h.channelName0,
    isPublic: h.isPublic,
  });
  channelId0 = tmp.channelId;
  invalidChannelId = Math.abs(channelId0) + 10;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid channel ID', () => {
    const data = h.postRequest(h.MSG_SEND_URL, {
      token: token0,
      channelId: invalidChannelId,
      message: h.message0
    });
    expect(data).toStrictEqual({ error: invChanId });
  });
  test('Message too short', () => {
    const data = h.postRequest(h.MSG_SEND_URL, {
      token: token0,
      channelId: channelId0,
      message: h.invalidShortMessage,
    });
    expect(data).toStrictEqual({ error: invMessage });
  });
  test('Message too long', () => {
    const data = h.postRequest(h.MSG_SEND_URL, {
      token: token0,
      channelId: channelId0,
      message: h.invalidLongMessage,
    });
    expect(data).toStrictEqual({ error: invMessage });
  });
  test('Valid channel, user exists but is not a member', () => {
    const data = h.postRequest(h.MSG_SEND_URL, {
      token: token1,
      channelId: channelId0,
      message: h.message0
    });
    expect(data).toStrictEqual({ error: nonMember });
  });
  test('Invalid Token', () => {
    const data = h.postRequest(h.MSG_SEND_URL, {
      token: h.invalidToken,
      channelId: channelId0,
      message: h.message0
    });
    expect(data).toStrictEqual({ error: invToken });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Sending a message', () => {
    let data = h.postRequest(h.MSG_SEND_URL, {
      token: token0,
      channelId: channelId0,
      message: h.message0
    });
    expect(data).toStrictEqual(<MessageId>{ messageId: expect.any(Number) });
    data = h.postRequest(h.MSG_SEND_URL, {
      token: token0,
      channelId: channelId0,
      message: h.message0
    });
    expect(data).toStrictEqual(<MessageId>{ messageId: expect.any(Number) });
  });
});
